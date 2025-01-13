import { Injectable, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, lastValueFrom, EMPTY } from "rxjs";
import {
  map,
  withLatestFrom,
  filter,
  distinctUntilChanged,
  catchError,
  distinct,
  tap,
} from "rxjs/operators";
import {
  Environment,
  Organization,
  Member,
  MemberRole,
  OrganizationErrors,
  OrganizationLoading,
} from "./organizations.interface";
import { SettingsService } from "../settings.service";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { TeamsService } from "../teams/teams.service";
import { Team } from "../teams/teams.interfaces";
import { EnvironmentsAPIService } from "../environments/environments-api.service";
import { MembersAPIService } from "./members-api.service";
import { OrganizationAPIService } from "./organizations-api.service";
import { TeamsAPIService } from "../teams/teams-api.service";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { OrganizationsService } from "../organizations.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { client } from "../api";

interface OrganizationsState {
  organizationMembers: Member[];
  organizationTeams: Team[];
  organizationEnvironments: Environment[];
  errors: OrganizationErrors;
  loading: OrganizationLoading;
  /** Has organizations loaded the first time? */
  initialLoad: boolean;
}

const initialState: OrganizationsState = {
  organizationMembers: [],
  organizationTeams: [],
  organizationEnvironments: [],
  errors: {
    createOrganization: "",
    addTeamMember: "",
    removeTeamMember: "",
    addOrganizationMember: "",
  },
  loading: {
    addTeamMember: "",
    removeTeamMember: "",
    addOrganizationMember: false,
  },
  initialLoad: false,
};

@Injectable({
  providedIn: "root",
})
export class OrganizationDetailService extends StatefulService<OrganizationsState> {
  private router = inject(Router);
  private organizationsService = inject(OrganizationsService);
  private environmentsAPIService = inject(EnvironmentsAPIService);
  private membersAPIService = inject(MembersAPIService);
  private organizationAPIService = inject(OrganizationAPIService);
  private snackBar = inject(MatSnackBar);
  private settingsService = inject(SettingsService);
  private subscriptionsService = inject(SubscriptionsService);
  private teamsAPIService = inject(TeamsAPIService);
  private teamsService = inject(TeamsService);

  orgSlug: string | null = null;
  initialLoad$ = this.getState$.pipe(
    map((data) => data.initialLoad),
    distinct()
  );

  readonly organizationMembers$ = this.getState$.pipe(
    map((data) => data.organizationMembers)
  );
  readonly orgHasAProject$ =
    this.organizationsService.activeOrganizationProjects$.pipe(
      map((projects) => !!projects && projects.length > 0)
    );
  readonly projectsCount$ =
    this.organizationsService.activeOrganizationProjects$.pipe(
      map((projects) => {
        if (!projects) {
          return 0;
        }
        return projects.length;
      })
    );

  readonly filteredAddTeamMembers$ = combineLatest([
    this.organizationMembers$,
    this.teamsService.teamMembers$,
  ]).pipe(
    map(([organizationMembers, teamMembers]) => {
      return organizationMembers.filter(
        (orgMembers) =>
          !teamMembers.find((teamMems) => orgMembers.id === teamMems.id)
      );
    })
  );
  readonly organizationTeams$ = this.getState$.pipe(
    map((data) => data.organizationTeams)
  );
  readonly selectedOrganizationTeams$ = this.organizationTeams$.pipe(
    map((data) => data)
  );

  readonly filteredOrganizationTeams$ = this.organizationTeams$.pipe(
    withLatestFrom(this.selectedOrganizationTeams$),
    filter(([orgTeams, selectedOrgTeams]) => orgTeams === selectedOrgTeams)
  );

  readonly organizationEnvironments$ = this.getState$.pipe(
    map((data) => data.organizationEnvironments)
  );

  readonly organizationEnvironmentsProcessed$ =
    this.organizationEnvironments$.pipe(
      map((environments) =>
        environments.reduce(
          (accumulator, environment) => [
            ...accumulator,
            ...(!accumulator.includes(environment.name)
              ? [environment.name]
              : []),
          ],
          [] as string[]
        )
      )
    );

  readonly errors$ = this.getState$.pipe(map((data) => data.errors));
  readonly loading$ = this.getState$.pipe(map((data) => data.loading));

  constructor() {
    super(initialState);

    // When billing is enabled, check if active org has subscription
    combineLatest([
      toObservable(this.settingsService.billingEnabled),
      this.organizationsService.activeOrganization$,
    ])
      .pipe(
        filter(
          ([billingEnabled, activeOrganization]) =>
            !!billingEnabled && !!activeOrganization
        ),
        distinctUntilChanged((a, b) => a[1]?.id === b[1]?.id),
        tap(([_, activeOrganization]) => {
          this.subscriptionsService.checkIfUserHasSubscription(
            activeOrganization!.slug
          );
        })
      )
      .subscribe();
  }

  updateOrganization(orgName: string) {
    const data = { name: orgName };
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    if (orgSlug) {
      return this.organizationAPIService.update(orgSlug, data).pipe(
        tap((resp) => {
          this.updateOrgName(resp);
        })
      );
    }
    return EMPTY;
  }

  /** Delete organization: route to home page */
  deleteOrganization(slug: string) {
    return client
      .DELETE("/api/0/organizations/{organization_slug}/", {
        params: { path: { organization_slug: slug } },
      })
      .then((result) => {
        if (result.response.status === 204) {
          this.organizationsService.organizationsResource.update((orgs) =>
            orgs?.filter((org) => org.slug !== slug)
          );

          const organizations = this.organizationsService.organizations();
          if (organizations.length) {
            this.organizationsService.setActiveOrganizationSlug(
              organizations[0].slug
            );
          } else {
            this.organizationsService.setActiveOrganizationSlug(null);
          }
          this.router.navigate([""]);
        }
        return result;
      });
  }

  retrieveOrganizationMembers(orgSlug: string) {
    return this.membersAPIService.list(orgSlug).pipe(
      tap((members) => {
        this.setActiveOrganizationMembers(members);
      })
    );
  }

  /** Invite a user via email to join an organization */
  inviteOrganizationMembers(
    emailInput: string,
    teamsInput: string[],
    roleInput: MemberRole
  ) {
    // const data = {
    //   email: emailInput,
    //   orgRole: roleInput,
    //   teamRoles: teamsInput.map((teamSlug) => {
    //     return { teamSlug, role: "" };
    //   }),
    // };
    // return this.activeOrganizationSlug$
    //   .pipe(
    //     take(1),
    //     mergeMap((orgSlug) =>
    //       this.membersAPIService
    //         .inviteUser(orgSlug!, data)
    //         .pipe(map((response) => ({ response, orgSlug })))
    //     ),
    //     tap(({ response, orgSlug }) => {
    //       this.setAddMemberLoading(false);
    //       this.snackBar.open(
    //         `An email invite has been sent to ${response.email}`
    //       );
    //       this.router.navigate([orgSlug, "settings", "members"]);
    //     }),
    //     catchError((error: HttpErrorResponse) => {
    //       if (error.status === 403) {
    //         this.setAddMemberError(
    //           "Only organization members with a role of manager or owner can invite new members."
    //         );
    //       } else if (error.error?.detail) {
    //         this.setAddMemberError(error.error?.detail);
    //       } else {
    //         this.setAddMemberError(
    //           "There was an error processing this request."
    //         );
    //       }
    //       return EMPTY;
    //     })
    //   )
    //   .toPromise();
  }

  retrieveOrganizationTeams(orgSlug: string) {
    lastValueFrom(
      this.teamsAPIService.list(orgSlug).pipe(
        tap((resp) => {
          this.setOrganizationTeams(resp);
        })
      )
    );
  }

  createTeam(teamSlug: string, orgSlug: string) {
    return this.teamsAPIService.create(orgSlug, teamSlug).pipe(
      tap((team) => {
        this.organizationsService.refreshActiveOrganization();
        this.teamsService.addTeam(team);
      })
    );
  }

  addTeamMember(member: Member, orgSlug: string, teamSlug: string) {
    return this.teamsAPIService.addTeamMember(member, orgSlug, teamSlug).pipe(
      tap((team: Team) => {
        lastValueFrom(
          this.teamsService.retrieveTeamMembers(orgSlug, team.slug)
        );
        lastValueFrom(this.retrieveOrganizationMembers(orgSlug));
      })
    );
  }

  removeTeamMember(memberId: number, teamSlug: string) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    if (orgSlug) {
      return this.teamsAPIService
        .removeTeamMember(memberId, orgSlug, teamSlug)
        .pipe(
          tap(() => {
            this.teamsService.removeMember(memberId);
          })
        );
    } else {
      return EMPTY;
    }
  }

  leaveTeam(teamSlug: string) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    this.setLeaveTeamLoading(teamSlug);
    lastValueFrom(
      this.teamsAPIService.leaveTeam(orgSlug!, teamSlug).pipe(
        tap((resp) => {
          this.snackBar.open(`You have left ${resp.slug}`);
          this.setTeamsView(resp.slug, resp.isMember, resp.memberCount);
        }),
        catchError((error: HttpErrorResponse) => {
          this.setLeaveTeamError(error);
          return EMPTY;
        })
      )
    );
  }

  joinTeam(teamSlug: string) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    this.setJoinTeamLoading(teamSlug);
    lastValueFrom(
      this.teamsAPIService.joinTeam(orgSlug!, teamSlug).pipe(
        tap((resp) => {
          this.snackBar.open(`You joined ${resp.slug}`);
          this.setTeamsView(resp.slug, resp.isMember, resp.memberCount);
        }),
        catchError((error: HttpErrorResponse) => {
          this.setJoinTeamError(error);
          return EMPTY;
        })
      )
    );
  }

  deleteTeam(slug: string) {
    this.updateTeamsView(slug);
  }

  updateTeam(id: number, newSlug: string) {
    this.updateTeamSlug(id, newSlug);
  }

  getOrganizationEnvironments(orgSlug: string) {
    return this.retrieveOrganizationEnvironments(orgSlug);
  }

  private retrieveOrganizationEnvironments(orgSlug: string) {
    return this.environmentsAPIService.list(orgSlug).pipe(
      tap((environments) => {
        this.setOrganizationEnvironments(environments);
      })
    );
  }

  clearErrorState() {
    this.setInitialErrorState();
  }

  private setInitialErrorState() {
    this.setState({
      errors: initialState.errors,
    });
  }

  private setLeaveTeamLoading(team: string) {
    const state = this.state.getValue();
    this.setState({
      loading: {
        ...state.loading,
        removeTeamMember: team,
      },
    });
  }

  private setJoinTeamLoading(team: string) {
    const state = this.state.getValue();
    this.setState({
      loading: {
        ...state.loading,
        addTeamMember: team,
      },
    });
  }

  // private setAddMemberLoading(loading: boolean) {
  //   const state = this.state.getValue();
  //   this.setState({
  //     loading: {
  //       ...state.loading,
  //       addOrganizationMember: loading,
  //     },
  //   });
  // }

  // private setAddMemberError(error: string) {
  //   const state = this.state.getValue();
  //   this.setState({
  //     errors: {
  //       ...state.errors,
  //       addOrganizationMember: error,
  //     },
  //     loading: {
  //       ...state.loading,
  //       addOrganizationMember: false,
  //     },
  //   });
  // }

  private setLeaveTeamError(error: HttpErrorResponse) {
    const state = this.state.getValue();
    this.setState({
      errors: {
        ...state.errors,
        removeTeamMember: `${error.statusText}: ${error.status}`,
      },
      loading: {
        ...state.loading,
        removeTeamMember: "",
      },
    });
  }

  private setJoinTeamError(error: HttpErrorResponse) {
    const state = this.state.getValue();
    this.setState({
      errors: {
        ...state.errors,
        addTeamMember: `${error.statusText}: ${error.status}`,
      },
      loading: {
        ...state.loading,
        addTeamMember: "",
      },
    });
  }

  private updateOrgName(orgName: Organization) {
    // const state = this.state.getValue();
    // if (state.organizations) {
    //   this.setState({
    //     organizations: state.organizations.map((organization) =>
    //       orgName.id === organization.id
    //         ? { ...organization, name: orgName.name }
    //         : organization
    //     ),
    //   });
    // }
  }

  private setActiveOrganizationMembers(members: Member[]) {
    this.setState({
      organizationMembers: members,
    });
  }

  private setOrganizationTeams(teams: Team[]) {
    this.setState({
      organizationTeams: teams,
    });
  }

  private setTeamsView(teamSlug: string, member: boolean, members: number) {
    // const state = this.state.getValue();
    // if (state.activeOrganization?.teams) {
    //   this.setState({
    //     activeOrganization: {
    //       ...state.activeOrganization,
    //       teams: state.activeOrganization?.teams.map((team) =>
    //         team.slug === teamSlug
    //           ? { ...team, isMember: member, memberCount: members }
    //           : team
    //       ),
    //     },
    //     loading: {
    //       ...state.loading,
    //       addTeamMember: "",
    //       removeTeamMember: "",
    //     },
    //   });
    // }
  }

  private updateTeamsView(slug: string) {
    // const state = this.state.getValue();
    // if (state.activeOrganization?.teams) {
    //   this.setState({
    //     activeOrganization: {
    //       ...state.activeOrganization,
    //       teams: state.activeOrganization?.teams.filter(
    //         (team) => team.slug !== slug
    //       ),
    //     },
    //   });
    // }
  }

  private updateTeamSlug(id: number, newSlug: string) {
    // const state = this.state.getValue();
    // if (state.activeOrganization?.teams) {
    //   this.setState({
    //     activeOrganization: {
    //       ...state.activeOrganization,
    //       teams: state.activeOrganization?.teams.map((team) =>
    //         team.id === id ? { ...team, slug: newSlug } : team
    //       ),
    //     },
    //   });
    // }
  }

  private setOrganizationEnvironments(environments: Environment[]) {
    this.setState({
      organizationEnvironments: environments,
    });
  }
}

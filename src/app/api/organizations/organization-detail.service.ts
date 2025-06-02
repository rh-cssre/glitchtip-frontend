import { Injectable, computed, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, lastValueFrom, EMPTY } from "rxjs";
import { filter, distinctUntilChanged, catchError, tap } from "rxjs/operators";
import {
  Environment,
  Organization,
  MemberRole,
  OrganizationErrors,
  OrganizationLoading,
} from "./organizations.interface";
import { SettingsService } from "../settings.service";
import { SubscriptionService } from "../subscriptions/subscription.service";
import { TeamsService } from "../teams/teams.service";
import { Team } from "../teams/teams.interfaces";
import { EnvironmentsAPIService } from "../environments/environments-api.service";
import { OrganizationAPIService } from "./organizations-api.service";
import { TeamsAPIService } from "../teams/teams-api.service";
import { OrganizationsService } from "../organizations.service";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { client } from "../api";
import { components } from "../api-schema";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

type Member = components["schemas"]["OrganizationUserSchema"];

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
  private organizationAPIService = inject(OrganizationAPIService);
  private snackBar = inject(MatSnackBar);
  private settingsService = inject(SettingsService);
  private subscriptionService = inject(SubscriptionService);
  private teamsAPIService = inject(TeamsAPIService);
  private teamsService = inject(TeamsService);

  readonly initialLoad = computed(() => this.state().initialLoad);
  readonly organizationMembers = computed(
    () => this.state().organizationMembers,
  );

  readonly orgHasAProject = computed(() => {
    const projects = this.organizationsService.activeOrganizationProjects();
    return !!projects && projects.length > 0;
  });

  readonly projectsCount = computed(() => {
    const projects = this.organizationsService.activeOrganizationProjects();
    if (!projects) {
      return 0;
    }
    return projects.length;
  });
  teamMembers = toSignal(this.teamsService.teamMembers$);

  readonly filteredAddTeamMembers = computed(() => {
    const organizationMembers = this.organizationMembers();
    const teamMembers = this.teamMembers() || [];

    return organizationMembers.filter(
      (orgMembers) =>
        !teamMembers.find(
          (teamMems) => orgMembers.id === teamMems.id.toString(),
        ),
    );
  });

  readonly organizationTeams = computed(() => this.state().organizationTeams);

  readonly selectedOrganizationTeams = computed(() => this.organizationTeams());

  readonly filteredOrganizationTeams = computed(() => {
    const orgTeams = this.organizationTeams();
    const selectedOrgTeams = this.selectedOrganizationTeams();
    return orgTeams === selectedOrgTeams;
  });

  readonly organizationEnvironments = computed(
    () => this.state().organizationEnvironments,
  );

  readonly organizationEnvironmentsProcessed = computed(() => {
    const environments = this.organizationEnvironments();
    return environments.reduce(
      (accumulator, environment) => [
        ...accumulator,
        ...(!accumulator.includes(environment.name) ? [environment.name] : []),
      ],
      [] as string[],
    );
  });

  readonly errors = computed(() => this.state().errors);
  readonly loading = computed(() => this.state().loading);

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
            !!billingEnabled && !!activeOrganization,
        ),
        distinctUntilChanged((a, b) => a[1]?.id === b[1]?.id),
        tap(([_, activeOrganization]) => {
          this.subscriptionService.checkIfUserHasSubscription(
            activeOrganization!.slug,
          );
        }),
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
        }),
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
            orgs?.filter((org) => org.slug !== slug),
          );

          const organizations = this.organizationsService.organizations();
          if (organizations.length) {
            this.organizationsService.setActiveOrganizationSlug(
              organizations[0].slug,
            );
          } else {
            this.organizationsService.setActiveOrganizationSlug(null);
          }
          this.router.navigate([""]);
        }
        return result;
      });
  }

  async retrieveOrganizationMembers(orgSlug: string) {
    const result = await client.GET(
      "/api/0/organizations/{organization_slug}/members/",
      {
        params: { path: { organization_slug: orgSlug } },
      },
    );
    if (result.data) {
      this.setActiveOrganizationMembers(result.data!);
    }
    return result;
  }

  /** Invite a user via email to join an organization */
  inviteOrganizationMembers(
    emailInput: string,
    teamsInput: string[],
    roleInput: MemberRole,
  ) {
    const orgSlug = this.organizationsService.activeOrganizationSlug();
    const data = {
      email: emailInput,
      orgRole: roleInput,
      teamRoles: teamsInput.map((teamSlug) => {
        return { teamSlug, role: "" };
      }),
      sendInvite: true,
      reinvite: true,
    };
    client
      .POST("/api/0/organizations/{organization_slug}/members/", {
        params: { path: { organization_slug: orgSlug } },
        body: data,
      })
      .then((result) => {
        if (result.data) {
          this.snackBar.open(
            `An email invite has been sent to ${result.data.email}`,
          );
          this.router.navigate([orgSlug, "settings", "members"]);
        } else {
          if (result.response.status === 403) {
            this.setAddMemberError(
              "Only organization members with a role of manager or owner can invite new members.",
            );
            // } else if (error.detail) {
            //   this.setAddMemberError(error.error?.detail);
          } else {
            this.setAddMemberError(
              "There was an error processing this request.",
            );
          }
        }
      });
  }

  retrieveOrganizationTeams(orgSlug: string) {
    lastValueFrom(
      this.teamsAPIService.list(orgSlug).pipe(
        tap((resp) => {
          this.setOrganizationTeams(resp);
        }),
      ),
    );
  }

  async createTeam(teamSlug: string, orgSlug: string) {
    const result = await client.POST(
      "/api/0/organizations/{organization_slug}/teams/",
      {
        params: { path: { organization_slug: orgSlug } },
        body: { slug: teamSlug },
      },
    );
    if (result.data) {
      this.organizationsService.refreshActiveOrganization();
      this.teamsService.addTeam(result.data as any);
    }
    return result;
  }

  addTeamMember(member: Member, orgSlug: string, teamSlug: string) {
    return this.teamsAPIService.addTeamMember(member, orgSlug, teamSlug).pipe(
      tap((team: Team) => {
        lastValueFrom(
          this.teamsService.retrieveTeamMembers(orgSlug, team.slug),
        );
        this.retrieveOrganizationMembers(orgSlug);
      }),
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
          }),
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
        }),
      ),
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
        }),
      ),
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
      }),
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
    const state = this.state();
    this.setState({
      loading: {
        ...state.loading,
        removeTeamMember: team,
      },
    });
  }

  private setJoinTeamLoading(team: string) {
    const state = this.state();
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

  private setAddMemberError(error: string) {
    const state = this.state();
    this.setState({
      errors: {
        ...state.errors,
        addOrganizationMember: error,
      },
      loading: {
        ...state.loading,
        addOrganizationMember: false,
      },
    });
  }

  private setLeaveTeamError(error: HttpErrorResponse) {
    const state = this.state();
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
    const state = this.state();
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

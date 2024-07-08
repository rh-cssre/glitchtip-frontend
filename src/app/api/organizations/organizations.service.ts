import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  Router,
  RoutesRecognized,
  ActivatedRoute,
  NavigationStart,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, lastValueFrom, Observable, EMPTY } from "rxjs";
import {
  map,
  withLatestFrom,
  filter,
  distinctUntilChanged,
  catchError,
  take,
  mergeMap,
  takeWhile,
  distinct,
  tap,
  first,
} from "rxjs/operators";
import {
  Environment,
  Organization,
  OrganizationDetail,
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

interface OrganizationsState {
  organizations: Organization[];
  activeOrganizationId: number | null;
  activeOrganization: OrganizationDetail | null;
  organizationMembers: Member[];
  organizationTeams: Team[];
  organizationEnvironments: Environment[];
  errors: OrganizationErrors;
  loading: OrganizationLoading;
  /** Has organizations loaded the first time? */
  initialLoad: boolean;
}

const initialState: OrganizationsState = {
  organizations: [],
  activeOrganizationId: null,
  activeOrganization: null,
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
export class OrganizationsService extends StatefulService<OrganizationsState> {
  orgSlug: string | null = null;
  initialLoad$ = this.getState$.pipe(
    map((data) => data.initialLoad),
    distinct()
  );

  readonly organizations$ = this.getState$.pipe(
    map((data) => data.organizations),
    distinct()
  );
  readonly organizationCount$ = this.organizations$.pipe(
    map((organizations) => organizations.length)
  );
  readonly activeOrganizationId$ = this.getState$.pipe(
    map((data) => data.activeOrganizationId)
  );
  readonly activeOrganization$ = this.getState$.pipe(
    map((data) => data.activeOrganization)
  );
  readonly activeOrganizationLoaded$ = this.getState$.pipe(
    map((data) => !!data.activeOrganization)
  );
  readonly organizationMembers$ = this.getState$.pipe(
    map((data) => data.organizationMembers)
  );
  readonly activeOrganizationProjects$ = this.activeOrganization$.pipe(
    map((data) => (data ? data.projects : null))
  );
  readonly orgHasAProject$ = this.activeOrganizationProjects$.pipe(
    map((projects) => !!projects && projects.length > 0)
  );
  readonly projectsCount$ = this.activeOrganizationProjects$.pipe(
    map((projects) => {
      if (!projects) {
        return 0;
      }
      return projects.length;
    })
  );
  readonly activeOrganizationDetail$ = combineLatest([
    this.organizations$,
    this.activeOrganizationId$,
  ]).pipe(
    map(([organizations, activeOrganization]) =>
      organizations.find(
        (organization) => organization.id === activeOrganization
      )
    )
  );
  readonly activeOrganizationSlug$ = combineLatest([
    this.organizations$,
    this.activeOrganizationId$,
  ]).pipe(
    map(([orgs, id]) => {
      const activeOrg = orgs.find((org) => org.id === id);
      if (activeOrg) {
        return activeOrg.slug;
      }
      return null;
    }),
    distinct()
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
  /**
   * Lots of kinds of router events; this isolates a specific kind in a tidy
   * and TypeScript-friendly way.
   */
  readonly navigationStart$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationStart)
  ) as Observable<NavigationStart>;

  /**
   * Lots of kinds of router events; this isolates a specific kind in a tidy
   * and TypeScript-friendly way.
   */
  readonly routesRecognized$ = this.router.events.pipe(
    filter((event) => event instanceof RoutesRecognized)
  ) as Observable<RoutesRecognized>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private environmentsAPIService: EnvironmentsAPIService,
    private membersAPIService: MembersAPIService,
    private organizationAPIService: OrganizationAPIService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    private subscriptionsService: SubscriptionsService,
    private teamsAPIService: TeamsAPIService,
    private teamsService: TeamsService
  ) {
    super(initialState);

    // When billing is enabled, check if active org has subscription
    combineLatest([
      this.settingsService.billingEnabled$,
      this.activeOrganization$,
    ])
      .pipe(
        filter(
          ([billingEnabled, activeOrganization]) =>
            billingEnabled && !!activeOrganization
        ),
        distinctUntilChanged((a, b) => a[1]?.id === b[1]?.id),
        tap(([_, activeOrganization]) => {
          this.subscriptionsService.checkIfUserHasSubscription(
            activeOrganization!.slug
          );
        })
      )
      .subscribe();

    this.activeOrganizationId$
      .pipe(
        filter((id) => id !== null),
        distinctUntilChanged(),
        withLatestFrom(this.organizations$),
        map(([id, orgs]) => orgs.find((org) => org.id === id)),
        filter((org) => org !== undefined),
        map((org) => org!.slug),
        tap((slug) => this.getOrganizationDetail(slug).toPromise())
      )
      .subscribe();
  }

  createOrganization(name: string) {
    const data = {
      name,
    };
    return this.organizationAPIService.create(data).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.detail) {
          this.setCreateOrgError(error.error?.detail);
        } else {
          this.setCreateOrgError(`${error.statusText}: ${error.status}`);
        }
        return EMPTY;
      }),
      tap((organization) => {
        lastValueFrom(
          this.retrieveOrganizations().pipe(
            tap(() => {
              this.setActiveOrganizationId(organization.id);
            })
          )
        );
      })
    );
  }

  retrieveOrganizations() {
    return this.organizationAPIService.list().pipe(
      tap((organizations) => this.setOrganizations(organizations)),
      withLatestFrom(this.activeOrganizationId$),
      tap(([organizations, activeOrgId]) => {
        if (activeOrgId === null && organizations.length) {
          let activeOrg: Organization | undefined;
          if (this.orgSlug) {
            activeOrg = organizations.find((org) => org.slug === this.orgSlug);
          }
          if (activeOrg) {
            this.changeActiveOrganization(activeOrg.id);
          } else {
            // Set default org
            this.changeActiveOrganization(organizations[0].id);
          }
        }
      })
    );
  }

  watchRoute(state: ActivatedRouteSnapshot) {
    this.orgSlug = state.paramMap.get("org-slug");
    if (this.orgSlug) {
      this.setActiveOrganizationFromRouteChange(this.orgSlug);
    }
    return true; // We use canActivate as a way to follow this param
  }

  /**
   * Change the active organization and if necessary
   * Update the route to reflect the organization slug update
   */
  changeActiveOrganization(activeOrganizationId: number) {
    this.setActiveOrganizationId(activeOrganizationId);
    this.activeOrganizationSlug$
      .pipe(
        take(1),
        filter((slug) => slug !== null),
        tap((slug) => {
          const oldSlug =
            this.route.snapshot.firstChild?.firstChild?.paramMap.get(
              "org-slug"
            );
          const firstChild = this.route.snapshot.firstChild?.firstChild;
          if (oldSlug && slug !== oldSlug && firstChild) {
            if (
              firstChild.firstChild?.url &&
              firstChild.firstChild.url.length >= 1
            ) {
              this.router.navigate([slug, firstChild.firstChild.url[0].path]);
            } else {
              this.router.navigate([slug]);
            }
          }
        })
      )
      .toPromise();
  }

  /**
   * Set active organization when a route change is observed
   * @slug organization slug as seen by the router
   *
   * Active organization can be set in state even in pages that don't have the organization slug,
   * for example the profile page.
   * However some pages have the organization slug in the route params. When this changes, whether by back button
   * or client side routing, the active org should change.
   * This function needs called when any such event happens.
   */
  setActiveOrganizationFromRouteChange(slug: string) {
    combineLatest([this.organizations$, this.initialLoad$])
      .pipe(
        takeWhile(([_, initialLoad]) => initialLoad === false, true),
        filter(([_, initialLoad]) => initialLoad),
        map(([organizations, _]) =>
          organizations.find((organization) => organization.slug === slug)
        ),
        filter((organization) => organization !== undefined),
        tap((organization) => {
          this.setActiveOrganizationId(organization!.id);
        })
      )
      .subscribe();
  }

  updateOrganization(orgName: string) {
    const data = { name: orgName };
    const orgSlug = this.state.getValue().activeOrganization?.slug;
    if (orgSlug) {
      return this.organizationAPIService.update(orgSlug, data).pipe(
        tap((resp) => {
          this.setActiveOrganizationId(resp.id);
          this.updateOrgName(resp);
        })
      );
    }
    return EMPTY;
  }

  /** Delete organization: route to home page */
  deleteOrganization(slug: string) {
    return this.organizationAPIService.destroy(slug).pipe(
      tap((_) => this.removeOrganization(slug)),
      withLatestFrom(this.organizations$),
      tap(([_, organizations]) => {
        if (organizations) {
          if (organizations.length) {
            this.setActiveOrganizationId(organizations[0].id);
          }
          this.router.navigate([""]);
        }
      })
    );
  }

  /** When you need updated information on the active org */
  refreshOrganizationDetail() {
    return this.activeOrganizationSlug$.pipe(
      first(),
      filter((orgSlug) => !!orgSlug),
      mergeMap((orgSlug) => this.getOrganizationDetail(orgSlug!))
    );
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
    const data = {
      email: emailInput,
      orgRole: roleInput,
      teamRoles: teamsInput.map((teamSlug) => {
        return { teamSlug, role: "" };
      }),
    };
    return this.activeOrganizationSlug$
      .pipe(
        take(1),
        mergeMap((orgSlug) =>
          this.membersAPIService
            .inviteUser(orgSlug!, data)
            .pipe(map((response) => ({ response, orgSlug })))
        ),
        tap(({ response, orgSlug }) => {
          this.setAddMemberLoading(false);
          this.snackBar.open(
            `An email invite has been sent to ${response.email}`
          );
          this.router.navigate([orgSlug, "settings", "members"]);
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.error?.detail) {
            this.setAddMemberError(error.error?.detail);
          } else {
            this.setAddMemberError(`${error.statusText}: ${error.status}`);
          }
          return EMPTY;
        })
      )
      .toPromise();
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
        this.refreshOrganizationDetail().subscribe();
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
    const orgSlug = this.state.getValue().activeOrganization?.slug;
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
    const orgSlug = this.state.getValue().activeOrganization?.slug;
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
    const orgSlug = this.state.getValue().activeOrganization?.slug;
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

  private setAddMemberLoading(loading: boolean) {
    const state = this.state.getValue();
    this.setState({
      loading: {
        ...state.loading,
        addOrganizationMember: loading,
      },
    });
  }

  private setCreateOrgError(error: string) {
    const state = this.state.getValue();
    this.setState({
      errors: {
        ...state.errors,
        createOrganization: error,
      },
    });
  }

  private setAddMemberError(error: string) {
    const state = this.state.getValue();
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

  private setOrganizations(organizations: Organization[]) {
    this.setState({
      organizations,
      initialLoad: true,
    });
  }

  private updateOrgName(orgName: Organization) {
    const state = this.state.getValue();
    if (state.organizations) {
      this.setState({
        organizations: state.organizations.map((organization) =>
          orgName.id === organization.id
            ? { ...organization, name: orgName.name }
            : organization
        ),
      });
    }
  }

  private setActiveOrganizationId(activeOrganizationId: number) {
    this.setState({
      activeOrganizationId,
    });
  }

  private setActiveOrganization(organization: OrganizationDetail) {
    this.setState({
      activeOrganization: organization,
    });
  }

  private removeOrganization(orgSlug: string) {
    const filteredOrgs = this.state
      .getValue()
      .organizations.filter((organization) => organization.slug !== orgSlug);
    if (filteredOrgs) {
      this.setState({
        organizations: filteredOrgs,
      });
    }
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
    const state = this.state.getValue();
    if (state.activeOrganization?.teams) {
      this.setState({
        activeOrganization: {
          ...state.activeOrganization,
          teams: state.activeOrganization?.teams.map((team) =>
            team.slug === teamSlug
              ? { ...team, isMember: member, memberCount: members }
              : team
          ),
        },
        loading: {
          ...state.loading,
          addTeamMember: "",
          removeTeamMember: "",
        },
      });
    }
  }

  private updateTeamsView(slug: string) {
    const state = this.state.getValue();
    if (state.activeOrganization?.teams) {
      this.setState({
        activeOrganization: {
          ...state.activeOrganization,
          teams: state.activeOrganization?.teams.filter(
            (team) => team.slug !== slug
          ),
        },
      });
    }
  }

  private updateTeamSlug(id: number, newSlug: string) {
    const state = this.state.getValue();
    if (state.activeOrganization?.teams) {
      this.setState({
        activeOrganization: {
          ...state.activeOrganization,
          teams: state.activeOrganization?.teams.map((team) =>
            team.id === id ? { ...team, slug: newSlug } : team
          ),
        },
      });
    }
  }

  private setOrganizationEnvironments(environments: Environment[]) {
    this.setState({
      organizationEnvironments: environments,
    });
  }

  private getOrganizationDetail(slug: string) {
    return this.organizationAPIService
      .retrieve(slug)
      .pipe(tap((organization) => this.setActiveOrganization(organization)));
  }
}

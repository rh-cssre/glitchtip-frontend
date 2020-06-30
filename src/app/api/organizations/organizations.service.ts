import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Router,
  RoutesRecognized,
  ActivatedRoute,
  NavigationStart,
} from "@angular/router";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import {
  tap,
  map,
  withLatestFrom,
  filter,
  distinctUntilChanged,
} from "rxjs/operators";
import { baseUrl } from "../../constants";
import {
  Organization,
  OrganizationDetail,
  Member,
} from "./organizations.interface";
import { SettingsService } from "../settings.service";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { TeamsService } from "../teams/teams.service";
import { Team } from "../teams/teams.interfaces";

interface OrganizationsState {
  organizations: Organization[];
  activeOrganizationId: number | null;
  activeOrganization: OrganizationDetail | null;
  organizationMembers: Member[];
  memberDetail: Member | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  activeOrganizationId: null,
  activeOrganization: null,
  organizationMembers: [],
  memberDetail: null,
};

@Injectable({
  providedIn: "root",
})
export class OrganizationsService {
  private readonly organizationsState = new BehaviorSubject<OrganizationsState>(
    initialState
  );
  private readonly getState$ = this.organizationsState.asObservable();
  private readonly url = baseUrl + "/organizations/";
  private routeParams?: { [key: string]: string };

  readonly organizations$ = this.getState$.pipe(
    map((data) => data.organizations)
  );
  readonly activeOrganizationId$ = this.getState$.pipe(
    map((data) => data.activeOrganizationId)
  );
  readonly activeOrganization$ = this.getState$.pipe(
    map((data) => data.activeOrganization)
  );
  readonly organizationMembers$ = this.getState$.pipe(
    map((data) => data.organizationMembers)
  );
  readonly activeOrganizationProjects$ = this.activeOrganization$.pipe(
    map((data) => (data ? data.projects : null))
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
  readonly activeOrganizationSlug$ = this.activeOrganizationDetail$.pipe(
    map((org) => (org ? org.slug : null))
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

  readonly memberDetail$ = this.getState$.pipe(
    map((data) => data.memberDetail)
  );

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

  /** Combine nested route params */
  readonly routeParams$ = this.routesRecognized$.pipe(
    map((event) => ({
      ...event.state.root.firstChild?.params,
      ...event.state.root.firstChild?.firstChild?.params,
    }))
  );

  /**
   * The only param we're really looking for from routeParams$ is the org slug,
   * so here's a tidy and well-typed way to use that specifically.
   */
  readonly orgSlugParam$ = this.routeParams$.pipe(
    map((params) => params["org-slug"])
  ) as Observable<string | undefined>;

  /**
   * Active org and org slug from URL can get out of sync. This should fix that.
   * Priority is given to the URL.
   */
  readonly urlAndActiveOrgMismatch$ = combineLatest([
    this.navigationStart$,
    this.orgSlugParam$,
    this.activeOrganization$,
    this.organizations$,
  ]).pipe(
    /**
     * We only care when the org slug in the route changes from one thing
     * to another.
     *
     * Overlook the letter variable names; I didn't want to do
     * previous[1] or whatever
     */
    distinctUntilChanged(
      ([a, previousOrgSlugParam, b, c], [d, nextOrgSlugParam, e, f]) =>
        previousOrgSlugParam === nextOrgSlugParam
    ),
    // If it's a back or forward event
    // If an active org is set
    // If there's an org slug in the route
    // If the org slug in the route doesn't match the active org slug
    filter(
      ([event, orgSlugParam, activeOrganization, _]) =>
        event.navigationTrigger === "popstate" &&
        activeOrganization !== null &&
        !!orgSlugParam &&
        activeOrganization.slug !== orgSlugParam
    ),
    tap(([_, orgSlugParam, __, organizations]) => {
      // Change active org to the org that matches the route's org slug
      const orgMatchedFromUrl = organizations.find(
        (organization) => organization.slug === orgSlugParam
      );
      if (orgMatchedFromUrl) {
        this.changeActiveOrganization(orgMatchedFromUrl.id);
      }
    })
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private subscriptionsService: SubscriptionsService,
    private teamsService: TeamsService
  ) {
    this.routeParams$.subscribe((params) => (this.routeParams = params));
    this.urlAndActiveOrgMismatch$.subscribe();

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
  }

  createOrganization(name: string) {
    const data = {
      name,
    };
    return this.http.post<OrganizationDetail>(this.url, data).pipe(
      tap((organization) => {
        this.retrieveOrganizations().toPromise();
        this.setActiveOrganizationId(organization.id);
      })
    );
  }

  retrieveOrganizations() {
    return this.http.get<Organization[]>(this.url).pipe(
      tap((organizations) => this.setOrganizations(organizations)),
      withLatestFrom(this.activeOrganizationId$),
      tap(([organizations, activeOrgId]) => {
        if (activeOrgId === null && organizations.length) {
          let activeOrg: Organization | undefined;
          if (this.routeParams) {
            activeOrg = organizations.find(
              (org) =>
                org.slug ===
                (this.routeParams ? this.routeParams["org-slug"] : null)
            );
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

  changeActiveOrganization(activeOrganizationId: number) {
    const activeOrgIdIsNull =
      this.organizationsState.getValue().activeOrganizationId === null;
    this.setActiveOrganizationId(activeOrganizationId);
    const organization = this.organizationsState
      .getValue()
      .organizations.find((org) => org.id === activeOrganizationId);
    if (organization) {
      this.getOrganizationDetail(organization.slug)
        .pipe(
          // Only navigate when the user goes from one organization to another
          filter(() => !activeOrgIdIsNull),
          tap((organizationDetail) => {
            // Switch org but stay in settings page
            if (
              this.routeParams &&
              this.routeParams["org-slug"] &&
              this.route.snapshot.firstChild?.url &&
              this.route.snapshot.firstChild.url[0].path === "settings"
            ) {
              this.router.navigate(["settings", organizationDetail.slug]);
            } else {
              // Fallback to viewing issues
              this.router.navigate([
                "organizations",
                organizationDetail.slug,
                "issues",
              ]);
            }
          })
        )
        .toPromise();
    }
  }

  updateOrganization(orgName: string) {
    const data = { name: orgName };
    const orgSlug = this.organizationsState.getValue().activeOrganization?.slug;
    return this.http
      .put<OrganizationDetail>(`${this.url}${orgSlug}/`, data)
      .pipe(
        tap((resp) => {
          this.setActiveOrganizationId(resp.id);
          this.updateOrgName(resp);
        })
      );
  }

  /** Delete organization: route to available org, if available or get empty org state on home page */
  deleteOrganization(slug: string) {
    const url = `${this.url}${slug}/`;
    return this.http.delete(url).pipe(
      tap((_) => this.removeOrganization(slug)),
      withLatestFrom(this.organizations$),
      tap(([_, organizations]) => {
        if (organizations) {
          if (organizations.length) {
            this.setActiveOrganizationId(organizations[0].id);
            this.router.navigate(["organizations", organizations[0].id]);
          } else {
            this.router.navigate([""]);
          }
        }
      })
    );
  }

  retrieveOrganizationMembers(orgSlug: string) {
    return this.http.get<Member[]>(`${this.url}${orgSlug}/members/`).pipe(
      tap((members) => {
        this.setActiveOrganizationMembers(members);
      })
    );
  }

  retrieveMemberDetail(orgSlug: string, memberId: string) {
    const url = `${this.url}${orgSlug}/members/${memberId}/`;
    return this.http
      .get<Member>(url)
      .pipe(tap((memberDetail) => this.setMemberDetail(memberDetail)));
  }

  createTeam(teamSlug: string, orgSlug: string) {
    const data = {
      slug: teamSlug,
    };
    return this.http.post<Team>(`${this.url}${orgSlug}/teams/`, data).pipe(
      tap((team) => {
        this.getOrganizationDetail(orgSlug).toPromise();
        this.teamsService.addTeam(team);
      })
    );
  }

  addTeamMember(
    member: Member,
    orgSlug: string | undefined,
    teamSlug: string | undefined
  ) {
    const url = `${this.url}${orgSlug}/members/${member.id}/teams/${teamSlug}/`;
    return this.http.post<Team>(url, member).pipe(
      tap((team: Team) => {
        if (orgSlug) {
          this.teamsService.retrieveTeamMembers(orgSlug, team.slug).toPromise();
          this.retrieveOrganizationMembers(orgSlug).toPromise();
        }
      })
    );
  }

  private setOrganizations(organizations: Organization[]) {
    this.organizationsState.next({
      ...this.organizationsState.getValue(),
      organizations,
    });
  }

  private updateOrgName(orgName: Organization) {
    const state = this.organizationsState.getValue();
    if (state.organizations) {
      this.organizationsState.next({
        ...state,
        organizations: state.organizations.map((organization) =>
          orgName.id === organization.id
            ? { ...organization, name: orgName.name }
            : organization
        ),
      });
    }
  }

  private setActiveOrganizationId(activeOrganizationId: number) {
    this.organizationsState.next({
      ...this.organizationsState.getValue(),
      activeOrganizationId,
    });
  }

  private setActiveOrganization(organization: OrganizationDetail) {
    this.organizationsState.next({
      ...this.organizationsState.getValue(),
      activeOrganization: organization,
    });
  }

  private removeOrganization(orgSlug: string) {
    const filteredOrgs = this.organizationsState
      .getValue()
      .organizations.filter((organization) => organization.slug !== orgSlug);
    if (filteredOrgs) {
      this.organizationsState.next({
        ...this.organizationsState.getValue(),
        organizations: filteredOrgs,
      });
    }
  }

  private setActiveOrganizationMembers(members: Member[]) {
    this.organizationsState.next({
      ...this.organizationsState.getValue(),
      organizationMembers: members,
    });
  }

  private setMemberDetail(member: Member) {
    this.organizationsState.next({
      ...this.organizationsState.getValue(),
      memberDetail: member,
    });
  }

  private getOrganizationDetail(slug: string) {
    return this.http
      .get<OrganizationDetail>(`${this.url}${slug}/`)
      .pipe(tap((organization) => this.setActiveOrganization(organization)));
  }
}

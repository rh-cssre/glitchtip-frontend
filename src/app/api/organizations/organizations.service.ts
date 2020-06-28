import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, RoutesRecognized, ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest } from "rxjs";
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private subscriptionsService: SubscriptionsService,
    private teamsService: TeamsService
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof RoutesRecognized) {
        // Combine nested route params
        this.routeParams = {
          ...val.state.root.firstChild?.params,
          ...val.state.root.firstChild?.firstChild?.params,
        };
      }
    });
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

  updateOrganization() {
    console.log("TODO: update org");
  }

  deleteOrganization(slug: string) {
    const url = `${this.url}${slug}/`;
    return this.http.delete(url);
  }

  retrieveOrganizationMembers(orgSlug: string) {
    return this.http
      .get<Member[]>(`${this.url}${orgSlug}/members/`)
      .pipe(tap((members) => this.setActiveOrganizationMembers(members)));
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
    return this.http.post<Team>(`${this.url}/${orgSlug}/teams/`, data).pipe(
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

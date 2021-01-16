import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { IssuesService } from "../issues.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { ProjectsService } from "src/app/api/projects/projects.service";
import { normalizeProjectParams } from "../utils";
import { OrganizationProject } from "src/app/api/organizations/organizations.interface";

@Component({
  selector: "app-issue-zero-states",
  templateUrl: "./issue-zero-states.component.html",
  styleUrls: ["./issue-zero-states.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueZeroStatesComponent implements OnInit, OnDestroy {
  subscription: Subscription | null = null;
  loading$ = this.issuesService.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  initialLoadComplete$ = this.issuesService.getState$.pipe(
    map((state) => state.pagination.initialLoadComplete)
  );
  orgHasAProject$ = this.organizationsService.orgHasAProject$;
  activeOrganizationProjects$ = this.organizationsService
    .activeOrganizationProjects$;
  activeProjectFirstEvent$ = this.projectsService.activeProjectFirstEvent$;
  activeProjectPlatform$ = this.projectsService.activeProjectPlatform$;
  activeProjectPlatformName$ = this.projectsService.activeProjectPlatformName$;
  firstProjectKey$ = this.projectsService.firstProjectKey$;

  projectsFromParams$ = this.activatedRoute.queryParams.pipe(
    map((params) => normalizeProjectParams(params.project))
  );

  copiedDsn = false;

  /**
   * Corresponds to project picker/header nav/project IDs in the URL
   * If the count is zero, we show issues from all projects
   */
  appliedProjectCount$ = this.projectsFromParams$.pipe(
    map((projects) => {
      if (Array.isArray(projects)) {
        return projects.length;
      }
      return 0;
    })
  );

  /**
   * Either a single project is applied with the picker, or there's only one
   * project in the org, which is functionally similar for some things
   */
  singleProjectApplied$ = combineLatest([
    this.appliedProjectCount$,
    this.activeOrganizationProjects$,
  ]).pipe(
    map(
      ([appliedProjectCount, activeOrganizationProjects]) =>
        appliedProjectCount === 1 || activeOrganizationProjects?.length === 1
    )
  );

  showOnboarding$ = combineLatest([
    this.singleProjectApplied$,
    this.activeProjectFirstEvent$,
  ]).pipe(
    map(
      ([singleProjectApplied, activeProjectFirstEvent]) =>
        singleProjectApplied && activeProjectFirstEvent === null
    )
  );

  projectsWhereAdminIsNotOnTheTeam$ = combineLatest([
    this.projectsFromParams$,
    this.activeOrganizationProjects$,
  ]).pipe(
    map(([projectsFromParams, activeOrgProjects]) => {
      if (!Array.isArray(projectsFromParams)) {
        return [];
      }
      const projectsMatchedFromParams: OrganizationProject[] = [];
      projectsFromParams.forEach((projectId) => {
        const matchedProject = activeOrgProjects?.find(
          (project) => project.id === parseInt(projectId, 10)
        );
        if (matchedProject) {
          projectsMatchedFromParams.push(matchedProject);
        }
      });
      return projectsMatchedFromParams.filter(
        (project) => project.isMember === false
      );
    })
  );

  userNotInSomeTeams$ = combineLatest([
    this.projectsWhereAdminIsNotOnTheTeam$,
    this.appliedProjectCount$,
  ]).pipe(
    map(
      ([projectsWhereAdminIsNotOnTheTeam, appliedProjectCount]) =>
        projectsWhereAdminIsNotOnTheTeam.length && appliedProjectCount > 1
    )
  );

  constructor(
    private issuesService: IssuesService,
    private organizationsService: OrganizationsService,
    private projectsService: ProjectsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
    ])
      .pipe(
        map(([params, _]) => {
          const orgSlug: string | undefined = params["org-slug"];
          return orgSlug;
        })
      )
      .subscribe((orgSlug) => {
        // Clear old state immediately on route change
        this.projectsService.clearActiveProject();
        if (orgSlug) {
          this.projectsService.retrieveCurrentProjectClientKeys(orgSlug);
        }
      });
  }

  ngOnDestroy() {
    this.projectsService.clearActiveProject();
    this.subscription?.unsubscribe();
  }

  copied() {
    this.copiedDsn = true;
    setTimeout(() => (this.copiedDsn = false), 4000);
  }
}

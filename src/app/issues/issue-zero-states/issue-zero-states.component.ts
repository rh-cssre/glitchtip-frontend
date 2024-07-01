import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { combineLatest } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";

import { IssuesService } from "../issues.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { normalizeProjectParams } from "src/app/shared/shared.utils";
import { OrganizationProject } from "src/app/api/projects/projects-api.interfaces";
import { ProjectsService } from "src/app/projects/projects.service";
import { ProjectKeysAPIService } from "src/app/api/projects/project-keys-api.service";
import { flattenedPlatforms } from "src/app/settings/projects/platform-picker/platforms-for-picker";
import { CopyInputComponent } from "../../shared/copy-input/copy-input.component";

@Component({
  selector: "gt-issue-zero-states",
  templateUrl: "./issue-zero-states.component.html",
  styleUrls: ["./issue-zero-states.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, CopyInputComponent, MarkdownModule],
})
export class IssueZeroStatesComponent implements OnInit {
  loading$ = combineLatest([
    this.issuesService.loading$,
    this.projectsService.loading$,
  ]).pipe(map((loads) => !loads.every((load) => !load)));
  initialLoadComplete$ = combineLatest([
    this.issuesService.initialLoadComplete$,
    this.projectsService.initialLoadComplete$,
  ]).pipe(map((loads) => loads.every((load) => !!load)));
  displayZeroStates$ = combineLatest([
    this.loading$,
    this.initialLoadComplete$,
  ]).pipe(
    map(
      ([loading, initialLoadComplete]) =>
        !loading && initialLoadComplete
    )
  );
  orgHasAProject$ = this.organizationsService.orgHasAProject$;
  projectsFromParams$ = this.activatedRoute.queryParams.pipe(
    map((params) => normalizeProjectParams(params.project))
  );
  activeOrganizationProjects$ =
    this.organizationsService.activeOrganizationProjects$;
  activeOrganizationSlug$ = this.organizationsService.activeOrganizationSlug$;
  activeProjectID$ = combineLatest([
    this.projectsFromParams$,
    this.activeOrganizationProjects$,
  ]).pipe(
    map(([projectIDs, activeOrgProjects]) => {
      if (projectIDs.length === 1) {
        return projectIDs[0];
      }
      if (activeOrgProjects?.length === 1) {
        return activeOrgProjects[0].id;
      }
      return null;
    }),
    distinctUntilChanged()
  );
  activeProject$ = combineLatest([
    this.projectsService.projects$,
    this.activeProjectID$,
  ]).pipe(
    map(([projects, activeProjectID]) => {
      if (projects && activeProjectID) {
        const activeProject = projects.find(
          (project) => project.id === activeProjectID
        );
        return activeProject ? activeProject : null;
      }
      return null;
    }),
    distinctUntilChanged()
  );
  showOnboarding$ = this.activeProject$.pipe(
    map((project) => !project?.firstEvent)
  );
  activeProjectPlatform$ = this.activeProject$.pipe(
    map((project) => project?.platform)
  );
  activeProjectSlug$ = this.activeProject$.pipe(
    map((project) => project?.slug)
  );
  activeProjectPlatformName$ = this.activeProjectPlatform$.pipe(
    map((id) => flattenedPlatforms.find((platform) => platform.id === id)?.name)
  );

  firstProjectKey$ = combineLatest([
    this.organizationsService.activeOrganizationSlug$,
    this.activeProject$,
  ]).pipe(
    filter(
      ([organizationSlug, activeProject]) =>
        !!organizationSlug && !!activeProject
    ),
    distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)),
    switchMap(([organizationSlug, activeProject]) =>
      this.projectKeysAPIService
        .list(organizationSlug!, activeProject!.slug)
        .pipe(map((keys) => keys[0]))
    )
  );
  errors$ = this.issuesService.errors$;

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
          (project) => project.id === projectId
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
    private projectKeysAPIService: ProjectKeysAPIService,
    private projectsService: ProjectsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectsService.retrieveProjects();
    // Attempt to replace YOUR-GLITCHTIP-DSN-HERE with actual project DSN
    this.firstProjectKey$.subscribe((project) => {
      const dsn = project.dsn.public;
      const elements = document.querySelectorAll("span.token.string");
      for (const element of Array.from(elements)) {
        if (element.textContent === '"YOUR-GLITCHTIP-DSN-HERE"') {
          element.innerHTML = '"' + dsn + '"';
        }
      }
    });
  }
}

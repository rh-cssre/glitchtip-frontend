import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  resource,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MarkdownComponent, provideMarkdown } from "ngx-markdown";

import { IssuesService } from "../issues.service";
import { ProjectsService } from "src/app/projects/projects.service";
import { CopyInputComponent } from "../../shared/copy-input/copy-input.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { client } from "src/app/shared/api/api";

@Component({
  selector: "gt-issue-zero-states",
  templateUrl: "./issue-zero-states.component.html",
  styleUrls: ["./issue-zero-states.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgTemplateOutlet,
    MatButtonModule,
    MatIconModule,
    CopyInputComponent,
    EmptyStateComponent,
    MarkdownComponent,
  ],
  providers: [provideMarkdown()],
})
export class IssueZeroStatesComponent implements OnInit {
  projects = input<string[]>();
  private issuesService = inject(IssuesService);
  private organizationsService = inject(OrganizationsService);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectKeyResource = resource({
    params: () => ({
      organizationSlug: this.activeOrganizationSlug(),
      projectSlug: this.activeProjectSlug(),
    }),
    loader: async ({ params }) => {
      if (!params.organizationSlug || !params.projectSlug) {
        return undefined;
      }
      const { data } = await client.GET(
        "/api/0/projects/{organization_slug}/{project_slug}/keys/",
        {
          params: {
            path: {
              organization_slug: params.organizationSlug,
              project_slug: params.projectSlug,
            },
          },
        },
      );
      if (data && data.length) {
        return data[0];
      }
      return undefined;
    },
  });

  loading = computed(
    () => this.projectsService.loading() || this.issuesService.loading(),
  );
  initialLoadComplete = computed(
    () =>
      this.projectsService.initialLoadComplete() &&
      this.issuesService.initialLoad(),
  );

  displayZeroStates = computed(
    () => !this.loading() && this.initialLoadComplete(),
  );
  orgHasAProject = computed(
    () => this.organizationsService.projectsCount() > 0,
  );
  activeOrganizationProjects =
    this.organizationsService.activeOrganizationProjects;
  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
  activeProjectID = computed(() => {
    const projectIDs = this.projects();
    const activeOrgProjects = this.activeOrganizationProjects();

    if (projectIDs === undefined) {
      return null;
    }

    if (projectIDs.length === 1) {
      return projectIDs[0];
    }
    if (activeOrgProjects?.length === 1) {
      return activeOrgProjects[0].id;
    }
    return null;
  });
  activeProject = computed(() => {
    const projects = this.projectsService.projects();
    const activeProjectID = this.activeProjectID();

    if (projects && activeProjectID) {
      // TODO remove toString
      const activeProject = projects.find(
        (project) => project.id.toString() === activeProjectID,
      );
      return activeProject ? activeProject : null;
    }
    return null;
  });

  showOnboarding = computed(() => !this.activeProject()?.firstEvent);
  activeProjectPlatform = computed(() => this.activeProject()?.platform);
  activeProjectSlug = computed(() => this.activeProject()?.slug);
  activeProjectPlatformName = computed(() => this.activeProject()?.name);
  firstProjectKey = computed(() => this.projectKeyResource.value());
  private dsn = computed(() => this.firstProjectKey()?.dsn.public ?? null);

  platformHasDocs = computed(() => {
    const platform = this.activeProjectPlatform();
    return !!platform && platform !== "other";
  });

  private platformMdSrc = computed(() => {
    if (!this.platformHasDocs()) return null;
    return `/static/sdk-docs/${this.activeProjectPlatform()}.md`;
  });

  private platformMdRaw = resource({
    params: () => this.platformMdSrc(),
    loader: async ({ params: src }) => {
      if (!src) return undefined;
      return fetch(src)
        .then((r) => (r.ok ? r.text() : undefined))
        .catch(() => undefined);
    },
  });

  platformMdLoading = this.platformMdRaw.isLoading;
  platformMdContent = computed(() => {
    const raw = this.platformMdRaw.value();
    if (!raw) return undefined;
    const dsn = this.dsn();
    return dsn ? raw.replaceAll("YOUR_DSN", dsn) : raw;
  });

  /**
   * Corresponds to project picker/header nav/project IDs in the URL
   * If the count is zero, we show issues from all projects
   */
  appliedProjectCount = computed(() => this.projects()?.length || 0);

  /**
   * Either a single project is applied with the picker, or there's only one
   * project in the org, which is functionally similar for some things
   */
  singleProjectApplied = computed(() => {
    const appliedProjectCount = this.appliedProjectCount();
    const activeOrganizationProjects = this.activeOrganizationProjects();
    return (
      appliedProjectCount === 1 || activeOrganizationProjects?.length === 1
    );
  });

  projectsWhereAdminIsNotOnTheTeam = computed(() => {
    const projectsFromParams = this.projects();
    const activeOrganizationProjects = this.activeOrganizationProjects();

    if (projectsFromParams === undefined) {
      return [];
    }

    return activeOrganizationProjects.filter(
      (project) =>
        projectsFromParams.includes(project.id) && project.isMember === false,
    );
  });

  adminNotOnTeam = computed(() => {
    const notOnTeam = this.projectsWhereAdminIsNotOnTheTeam();
    return notOnTeam.length > 0 && notOnTeam.length < 2;
  });

  /**
   * The single zero-state to show. Setup instructions, no-access and the empty
   * states are mutually exclusive, so the page never stacks two of them.
   */
  zeroStateKind = computed<
    "no-projects" | "no-access" | "onboarding" | "no-results" | null
  >(() => {
    if (!this.displayZeroStates()) return null;
    if (!this.orgHasAProject()) return "no-projects";
    if (this.adminNotOnTeam()) return "no-access";
    if (this.singleProjectApplied() && this.showOnboarding())
      return "onboarding";
    return "no-results";
  });

  noAccessMessage = computed(() =>
    this.singleProjectApplied()
      ? $localize`You're not on this project's team. Ask an organization admin to add you.`
      : $localize`You're not on the team for at least one of the selected projects. Ask an organization admin to add you.`,
  );

  clearFilters() {
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  ngOnInit() {
    this.projectsService.retrieveProjects();
  }
}

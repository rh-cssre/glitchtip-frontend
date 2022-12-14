import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY } from "rxjs";
import { tap, map, catchError, filter, first } from "rxjs/operators";
import { OrganizationProject } from "../../api/organizations/organizations.interface";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "src/app/shared/stateful-service/pagination-stateful-service";
import {
  Project,
  ProjectDetail,
  ProjectKey,
  ProjectNew,
} from "../../api/projects/projects-api.interfaces";
import { ProjectsAPIService } from "../../api/projects/projects-api.service";
import { ProjectKeysAPIService } from "../../api/projects/project-keys-api.service";

interface ProjectLoading {
  addProjectToTeam: boolean;
  removeProjectFromTeam: string;
}

interface ProjectError {
  addProjectToTeam: string;
  removeProjectFromTeam: string;
}

interface ProjectSettingsState extends PaginationStatefulServiceState {
  projects: Project[] | null;
  projectsOnTeam: Project[];
  projectsNotOnTeam: Project[];
  projectDetail: ProjectDetail | null;
  projectKeys: ProjectKey[] | null;
  loading: ProjectLoading;
  errors: ProjectError;
}

const initialState: ProjectSettingsState = {
  projects: null,
  projectsOnTeam: [],
  projectsNotOnTeam: [],
  projectDetail: null,
  projectKeys: null,
  loading: { addProjectToTeam: false, removeProjectFromTeam: "" },
  errors: { addProjectToTeam: "", removeProjectFromTeam: "" },
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class ProjectSettingsService extends PaginationStatefulService<ProjectSettingsState> {
  readonly projects$ = this.getState$.pipe(map((data) => data.projects));

  readonly activeProject$ = this.getState$.pipe(
    map((data) => data.projectDetail)
  );
  readonly activeProjectSlug$ = this.activeProject$.pipe(
    map((data) => data?.slug)
  );
  readonly projectKeys$ = this.getState$.pipe(map((data) => data.projectKeys));

  readonly projectsOnTeam$ = this.getState$.pipe(
    map((data) => data.projectsOnTeam)
  );
  readonly projectsNotOnTeam$ = this.getState$.pipe(
    map((data) => data.projectsNotOnTeam)
  );
  readonly addRemoveLoading$ = this.getState$.pipe(map((data) => data.loading));
  readonly errors$ = this.getState$.pipe(map((data) => data.errors));

  constructor(
    private snackBar: MatSnackBar,
    private projectsAPIService: ProjectsAPIService,
    private projectKeysAPIService: ProjectKeysAPIService
  ) {
    super(initialState);
  }

  createProject(project: ProjectNew, teamSlug: string, orgSlug: string) {
    return this.projectsAPIService
      .create(project, teamSlug, orgSlug)
      .pipe(tap((newProject) => this.addOneProject(newProject)));
  }

  retrieveProjects(organizationSlug: string) {
    this.projectsAPIService
      .list(organizationSlug)
      .pipe(tap((projects) => this.setProjects(projects)))
      .subscribe();
  }

  /**
   * Calls retrieveProjectDetail with the active org slug and the slug of a
   * single project. Project comes from either the URL or the active org list
   *
   * @param project An array of project IDs that come from the URL
   * @param activeOrgProjects All projects associated with the active organization
   * @param orgSlug Active organization slug
   */
  getProjectDetails(
    project: string[] | null,
    activeOrgProjects: OrganizationProject[] | null,
    orgSlug: string
  ) {
    if (activeOrgProjects) {
      let matchingProject: OrganizationProject | null = null;
      if (project && project.length === 1) {
        const match = activeOrgProjects.find(
          (activeOrgProject) => activeOrgProject.id === parseInt(project[0], 10)
        );
        if (match) matchingProject = match;
      } else if (activeOrgProjects.length === 1) {
        matchingProject = activeOrgProjects[0];
      }

      if (matchingProject) {
        this.retrieveProjectDetail(orgSlug, matchingProject.slug);
      }
    }
  }

  addProjectToTeam(orgSlug: string, teamSlug: string, projectSlug: string) {
    this.setAddProjectToTeamLoading(true);
    this.projectsAPIService
      .addProjectToTeam(orgSlug, teamSlug, projectSlug)
      .pipe(
        tap((resp) => {
          this.snackBar.open(`${resp.slug} has been added to #${teamSlug}`);
          this.setAddProjectToTeam(resp);
        }),
        catchError((error: HttpErrorResponse) => {
          this.setAddProjectToTeamError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  removeProjectFromTeam(
    orgSlug: string,
    teamSlug: string,
    projectSlug: string
  ) {
    this.setRemoveProjectFromTeamLoading(projectSlug);
    return this.projectsAPIService
      .removeProjectFromTeam(orgSlug, teamSlug, projectSlug)
      .pipe(
        tap((resp) => {
          this.snackBar.open(`${resp.slug} has been removed from #${teamSlug}`);
          this.setRemoveProjectFromTeam(resp);
        }),
        catchError((error: HttpErrorResponse) => {
          this.setRemoveProjectFromTeamLoadingError(error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  retrieveProjectsOnTeam(orgSlug: string, teamSlug: string) {
    const query = `team:${teamSlug}`;
    this.projectsAPIService
      .list(orgSlug, query)
      .pipe(tap((resp) => this.setProjectsPerTeam(resp)))
      .subscribe();
  }

  retrieveProjectsNotOnTeam(orgSlug: string, teamSlug: string) {
    const query = `!team:${teamSlug}`;
    return this.projectsAPIService
      .list(orgSlug, query)
      .pipe(tap((resp) => this.setProjectsNotOnTeam(resp)))
      .subscribe();
  }

  retrieveProjectDetail(organizationSlug: string, projectSlug: string) {
    this.projectsAPIService
      .retrieve(organizationSlug, projectSlug)
      .pipe(tap((activeProject) => this.setActiveProject(activeProject)))
      .subscribe();
  }

  retrieveCurrentProjectClientKeys(organizationSlug: string) {
    this.activeProject$
      .pipe(
        filter((project) => !!project),
        first(),
        tap((project) => {
          return this.projectKeysAPIService
            .list(organizationSlug, project!.slug)
            .pipe(tap((projectKeys) => this.setKeys(projectKeys)))
            .subscribe();
        })
      )
      .subscribe();
  }

  updateProjectName(orgSlug: string, projectSlug: string, projectName: string) {
    const data = { name: projectName };
    return this.projectsAPIService
      .update(orgSlug, projectSlug, data)
      .pipe(tap((resp) => this.setActiveProject(resp)));
  }

  updateProjectPlatform(
    orgSlug: string,
    projectSlug: string,
    projectPlatform: string,
    projectName: string
  ) {
    const data = { name: projectName, platform: projectPlatform };
    return this.projectsAPIService
      .update(orgSlug, projectSlug, data)
      .pipe(tap((resp) => this.setActiveProject(resp)));
  }

  deleteProject(organizationSlug: string, projectSlug: string) {
    return this.projectsAPIService.destroy(organizationSlug, projectSlug);
  }

  private setAddProjectToTeamError(error: HttpErrorResponse) {
    const state = this.state.getValue();
    this.setState({
      errors: {
        ...state.errors,
        addProjectToTeam: `${error.statusText}: ${error.status}`,
      },
      loading: {
        ...state.loading,
        addProjectToTeam: false,
      },
    });
  }

  private setAddProjectToTeamLoading(loading: boolean) {
    const state = this.state.getValue();
    this.setState({
      loading: {
        ...state.loading,
        addProjectToTeam: loading,
      },
    });
  }

  private setRemoveProjectFromTeamLoading(projectSlug: string) {
    const state = this.state.getValue();
    this.setState({
      loading: {
        ...state.loading,
        removeProjectFromTeam: projectSlug,
      },
    });
  }

  private setRemoveProjectFromTeamLoadingError(error: HttpErrorResponse) {
    const state = this.state.getValue();
    this.setState({
      errors: {
        ...state.errors,
        removeProjectFromTeam: `${error.statusText}: ${error.status}`,
      },
      loading: {
        ...state.loading,
        removeProjectFromTeam: "",
      },
    });
  }

  private setProjects(projects: Project[]) {
    this.setState({ projects });
  }

  private setProjectsPerTeam(projectsOnTeam: Project[]) {
    this.setState({
      projectsOnTeam,
    });
  }

  private setProjectsNotOnTeam(projectsNotOnTeam: Project[]) {
    this.setState({
      projectsNotOnTeam,
    });
  }

  private setActiveProject(projectDetail: ProjectDetail) {
    this.setState({
      projectDetail,
    });
  }

  private addOneProject(project: Project) {
    const newProjects = this.state.getValue().projects?.concat([project]);
    if (newProjects) {
      this.setState({
        projects: newProjects,
      });
    }
  }

  private setRemoveProjectFromTeam(project: Project) {
    const filteredTeams = this.state
      .getValue()
      .projectsOnTeam.filter(
        (currentProject) => currentProject.slug !== project.slug
      );
    const notOnTeam = this.state
      .getValue()
      .projectsNotOnTeam?.concat([project]);
    this.setState({
      projectsOnTeam: filteredTeams,
      projectsNotOnTeam: notOnTeam,
      loading: {
        ...this.state.getValue().loading,
        removeProjectFromTeam: "",
      },
    });
  }

  private setAddProjectToTeam(project: Project) {
    const notOnTeam = this.state
      .getValue()
      .projectsNotOnTeam.filter(
        (currentProject) => currentProject.slug !== project.slug
      );
    const onTeam = this.state.getValue().projectsOnTeam?.concat([project]);
    this.setState({
      projectsOnTeam: onTeam,
      projectsNotOnTeam: notOnTeam,
      loading: {
        ...this.state.getValue().loading,
        addProjectToTeam: false,
      },
    });
  }

  private setKeys(projectKeys: ProjectKey[]) {
    this.setState({ projectKeys });
  }

  clearActiveProject() {
    this.setState({ projectDetail: null, projectKeys: null });
  }
}

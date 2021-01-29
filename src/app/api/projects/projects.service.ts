import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, EMPTY } from "rxjs";
import { tap, map, catchError, filter, first } from "rxjs/operators";
import { baseUrl } from "../../constants";
import {
  Project,
  ProjectKey,
  ProjectDetail,
  ProjectNew,
  ProjectLoading,
  ProjectError,
} from "./projects.interfaces";
import { OrganizationsService } from "../organizations/organizations.service";
import { OrganizationProject } from "../organizations/organizations.interface";
import { flattenedPlatforms } from "src/app/settings/projects/platform-picker/platforms-for-picker";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "src/app/shared/stateful-service/pagination-stateful-service";

interface ProjectsState extends PaginationStatefulServiceState {
  projects: Project[] | null;
  projectsOnTeam: Project[];
  projectsNotOnTeam: Project[];
  projectDetail: ProjectDetail | null;
  projectKeys: ProjectKey[] | null;
  loading: ProjectLoading;
  errors: ProjectError;
}

const initialState: ProjectsState = {
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
export class ProjectsService extends PaginationStatefulService<ProjectsState> {
  private readonly url = baseUrl + "/projects/";

  readonly projects$ = this.getState$.pipe(map((data) => data.projects));

  readonly activeProject$ = this.getState$.pipe(
    map((data) => data.projectDetail)
  );
  readonly activeProjectSlug$ = this.activeProject$.pipe(
    map((data) => data?.slug)
  );
  readonly activeProjectFirstEvent$ = this.activeProject$.pipe(
    map((project) => (project ? project.firstEvent : null))
  );
  readonly activeProjectPlatform$ = this.activeProject$.pipe(
    map((project) => (project ? project.platform : null))
  );
  readonly activeProjectPlatformName$ = this.activeProjectPlatform$.pipe(
    map(
      (id) =>
        flattenedPlatforms.find((platform) => platform.id === id)?.name || id
    )
  );
  readonly projectKeys$ = this.getState$.pipe(map((data) => data.projectKeys));
  readonly firstProjectKey$ = this.projectKeys$.pipe(
    map((data) => (data ? data[0] : null))
  );

  readonly projectsForActiveOrg$ = combineLatest([
    this.projects$,
    this.organizationsService.activeOrganizationId$,
  ]).pipe(
    map(([projects, activeOrg]) =>
      projects?.filter((project) => project.organization.id === activeOrg)
    )
  );
  readonly projectsOnTeam$ = this.getState$.pipe(
    map((data) => data.projectsOnTeam)
  );
  readonly projectsNotOnTeam$ = this.getState$.pipe(
    map((data) => data.projectsNotOnTeam)
  );
  readonly loading$ = this.getState$.pipe(map((data) => data.loading));
  readonly errors$ = this.getState$.pipe(map((data) => data.errors));

  constructor(
    private http: HttpClient,
    private organizationsService: OrganizationsService,
    private snackBar: MatSnackBar
  ) {
    super(initialState);
  }

  createProject(project: ProjectNew, teamSlug: string, orgSlug: string) {
    const url = `${baseUrl}/teams/${orgSlug}/${teamSlug}/projects/`;
    return this.http
      .post<Project>(url, project)
      .pipe(tap((newProject) => this.addOneProject(newProject)));
  }

  retrieveProjects() {
    return this.http
      .get<Project[]>(this.url)
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
    const url = `${this.url}${orgSlug}/${projectSlug}/teams/${teamSlug}/`;
    this.setAddProjectToTeamLoading(true);
    return this.http
      .post<Project>(url, null)
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
    const url = `${this.url}${orgSlug}/${projectSlug}/teams/${teamSlug}/`;
    this.setRemoveProjectFromTeamLoading(projectSlug);
    return this.http
      .delete<Project>(url)
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
    const url = `${baseUrl}/organizations/${orgSlug}/projects`;
    const query = new HttpParams({
      fromString: `query=team%3A${teamSlug}`,
    });
    return this.http
      .get<Project[]>(url, { params: query })
      .pipe(tap((resp) => this.setProjectsPerTeam(resp)))
      .subscribe();
  }

  retrieveProjectsNotOnTeam(orgSlug: string, teamSlug: string) {
    const url = `${baseUrl}/organizations/${orgSlug}/projects`;
    const query = new HttpParams({
      fromString: `query=!team%3A${teamSlug}`,
    });
    return this.http
      .get<Project[]>(url, { params: query })
      .pipe(tap((resp) => this.setProjectsNotOnTeam(resp)))
      .subscribe();
  }

  retrieveProjectDetail(organizationSlug: string, projectSlug: string) {
    const url = `${this.url}${organizationSlug}/${projectSlug}/`;
    return this.http
      .get<ProjectDetail>(url)
      .pipe(tap((activeProject) => this.setActiveProject(activeProject)))
      .subscribe();
  }

  retrieveCurrentProjectClientKeys(organizationSlug: string) {
    this.activeProject$
      .pipe(
        filter((project) => !!project),
        first(),
        tap((project) => {
          const keysUrl = `${this.url}${organizationSlug}/${
            project!.slug
          }/keys/`;
          return this.http
            .get<ProjectKey[]>(keysUrl)
            .pipe(tap((projectKeys) => this.setKeys(projectKeys)))
            .subscribe();
        })
      )
      .subscribe();
  }

  updateProjectName(orgSlug: string, projectSlug: string, projectName: string) {
    const url = `${this.url}${orgSlug}/${projectSlug}/`;
    const data = { name: projectName };
    return this.http
      .put<ProjectDetail>(url, data)
      .pipe(tap((resp) => this.setActiveProject(resp)));
  }

  updateProjectPlatform(
    orgSlug: string,
    projectSlug: string,
    projectPlatform: string,
    projectName: string
  ) {
    const url = `${this.url}${orgSlug}/${projectSlug}/`;
    const data = { name: projectName, platform: projectPlatform };
    return this.http
      .put<ProjectDetail>(url, data)
      .pipe(tap((resp) => this.setActiveProject(resp)));
  }

  deleteProject(organizationSlug: string, projectSlug: string) {
    const deleteUrl = `${this.url}${organizationSlug}/${projectSlug}/`;
    return this.http.delete(deleteUrl);
  }

  private setAddProjectToTeamError(error: HttpErrorResponse) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
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
    this.state.next({
      ...state,
      loading: {
        ...state.loading,
        addProjectToTeam: loading,
      },
    });
  }

  private setRemoveProjectFromTeamLoading(projectSlug: string) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      loading: {
        ...state.loading,
        removeProjectFromTeam: projectSlug,
      },
    });
  }

  private setRemoveProjectFromTeamLoadingError(error: HttpErrorResponse) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
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
    this.state.next({ ...this.state.getValue(), projects });
  }

  private setProjectsPerTeam(projectsOnTeam: Project[]) {
    this.state.next({
      ...this.state.getValue(),
      projectsOnTeam,
    });
  }

  private setProjectsNotOnTeam(projectsNotOnTeam: Project[]) {
    this.state.next({
      ...this.state.getValue(),
      projectsNotOnTeam,
    });
  }

  private setActiveProject(projectDetail: ProjectDetail) {
    this.state.next({
      ...this.state.getValue(),
      projectDetail,
    });
  }

  private addOneProject(project: Project) {
    const newProjects = this.state.getValue().projects?.concat([project]);
    if (newProjects) {
      this.state.next({
        ...this.state.getValue(),
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
    this.state.next({
      ...this.state.getValue(),
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
    this.state.next({
      ...this.state.getValue(),
      projectsOnTeam: onTeam,
      projectsNotOnTeam: notOnTeam,
      loading: {
        ...this.state.getValue().loading,
        addProjectToTeam: false,
      },
    });
  }

  private setKeys(projectKeys: ProjectKey[]) {
    this.state.next({ ...this.state.getValue(), projectKeys });
  }

  clearActiveProject() {
    this.state.next({
      ...this.state.getValue(),
      projectDetail: null,
      projectKeys: null,
    });
  }
}

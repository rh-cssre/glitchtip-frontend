import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";
import { BehaviorSubject, combineLatest, EMPTY } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
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
import { MatSnackBar } from "@angular/material/snack-bar";

interface ProjectsState {
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
};

@Injectable({
  providedIn: "root",
})
export class ProjectsService {
  private readonly projectsState = new BehaviorSubject<ProjectsState>(
    initialState
  );
  private readonly getState$ = this.projectsState.asObservable();
  private readonly url = baseUrl + "/projects/";

  readonly projects$ = this.getState$.pipe(map((data) => data.projects));

  readonly activeProject$ = this.getState$.pipe(
    map((data) => data.projectDetail)
  );
  readonly projectKeys$ = this.getState$.pipe(map((data) => data.projectKeys));

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
  ) {}

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

  retrieveClientKeys(organizationSlug: string, projectSlug: string) {
    const keysUrl = `${this.url}${organizationSlug}/${projectSlug}/keys/`;
    return this.http
      .get<ProjectKey[]>(keysUrl)
      .pipe(tap((projectKeys) => this.setKeys(projectKeys)))
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
    const state = this.projectsState.getValue();
    this.projectsState.next({
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
    const state = this.projectsState.getValue();
    this.projectsState.next({
      ...state,
      loading: {
        ...state.loading,
        addProjectToTeam: loading,
      },
    });
  }

  private setRemoveProjectFromTeamLoading(projectSlug: string) {
    const state = this.projectsState.getValue();
    this.projectsState.next({
      ...state,
      loading: {
        ...state.loading,
        removeProjectFromTeam: projectSlug,
      },
    });
  }

  private setRemoveProjectFromTeamLoadingError(error: HttpErrorResponse) {
    const state = this.projectsState.getValue();
    this.projectsState.next({
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
    this.projectsState.next({ ...this.projectsState.getValue(), projects });
  }

  private setProjectsPerTeam(projectsOnTeam: Project[]) {
    this.projectsState.next({
      ...this.projectsState.getValue(),
      projectsOnTeam,
    });
  }

  private setProjectsNotOnTeam(projectsNotOnTeam: Project[]) {
    this.projectsState.next({
      ...this.projectsState.getValue(),
      projectsNotOnTeam,
    });
  }

  private setActiveProject(projectDetail: ProjectDetail) {
    this.projectsState.next({
      ...this.projectsState.getValue(),
      projectDetail,
    });
  }

  private addOneProject(project: Project) {
    const newProjects = this.projectsState
      .getValue()
      .projects?.concat([project]);
    if (newProjects) {
      this.projectsState.next({
        ...this.projectsState.getValue(),
        projects: newProjects,
      });
    }
  }

  private setRemoveProjectFromTeam(project: Project) {
    const filteredTeams = this.projectsState
      .getValue()
      .projectsOnTeam.filter(
        (currentProject) => currentProject.slug !== project.slug
      );
    const notOnTeam = this.projectsState
      .getValue()
      .projectsNotOnTeam?.concat([project]);
    this.projectsState.next({
      ...this.projectsState.getValue(),
      projectsOnTeam: filteredTeams,
      projectsNotOnTeam: notOnTeam,
      loading: {
        ...this.projectsState.getValue().loading,
        removeProjectFromTeam: "",
      },
    });
  }

  private setAddProjectToTeam(project: Project) {
    const notOnTeam = this.projectsState
      .getValue()
      .projectsNotOnTeam.filter(
        (currentProject) => currentProject.slug !== project.slug
      );
    const onTeam = this.projectsState
      .getValue()
      .projectsOnTeam?.concat([project]);
    this.projectsState.next({
      ...this.projectsState.getValue(),
      projectsOnTeam: onTeam,
      projectsNotOnTeam: notOnTeam,
      loading: {
        ...this.projectsState.getValue().loading,
        addProjectToTeam: false,
      },
    });
  }

  private setKeys(projectKeys: ProjectKey[]) {
    this.projectsState.next({ ...this.projectsState.getValue(), projectKeys });
  }
}

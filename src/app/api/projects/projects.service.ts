import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, of, combineLatest } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { baseUrl } from "../../constants";
import {
  ProjectNew,
  Project,
  ProjectKey,
  ProjectDetail,
} from "./projects.interfaces";
import { OrganizationsService } from "../organizations/organizations.service";

interface ProjectsState {
  projects: Project[] | null;
  projectDetail: ProjectDetail | null;
  projectKeys: ProjectKey[] | null;
}

const initialState: ProjectsState = {
  projects: null,
  projectDetail: null,
  projectKeys: null,
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

  constructor(
    private http: HttpClient,
    private organizationsService: OrganizationsService
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

  updateProject(
    organizationSlug: string,
    projectSlug: string,
    project: ProjectNew
  ) {
    const url = `${this.url}${organizationSlug}/${projectSlug}/`;
    return this.http.put<Project>(url, project).pipe(
      tap((_) => console.log("Post Status", _)),
      catchError((err) => "error alert")
    );
  }

  deleteProject(organizationSlug: string, projectSlug: string) {
    const deleteUrl = `${this.url}${organizationSlug}/${projectSlug}/`;
    return this.http.delete(deleteUrl).pipe(
      map(() => this.removeOneProject(projectSlug)),
      catchError((err: HttpErrorResponse) => of(err))
    );
  }

  private setProjects(projects: Project[]) {
    this.projectsState.next({ ...this.projectsState.getValue(), projects });
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

  private removeOneProject(projectSlug: string) {
    const filteredProjects = this.projectsState
      .getValue()
      .projects?.filter((project) => project.slug !== projectSlug);
    if (filteredProjects) {
      this.projectsState.next({
        ...this.projectsState.getValue(),
        projects: filteredProjects,
      });
    }
  }

  private setKeys(projectKeys: ProjectKey[]) {
    this.projectsState.next({ ...this.projectsState.getValue(), projectKeys });
  }
}

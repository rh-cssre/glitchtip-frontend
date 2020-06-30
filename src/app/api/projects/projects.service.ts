import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest } from "rxjs";
import { tap, map } from "rxjs/operators";
import { baseUrl } from "../../constants";
import {
  Project,
  ProjectKey,
  ProjectDetail,
  ProjectNew,
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

  private setKeys(projectKeys: ProjectKey[]) {
    this.projectsState.next({ ...this.projectsState.getValue(), projectKeys });
  }
}

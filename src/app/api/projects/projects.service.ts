import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { ProjectNew, Project } from "./projects.interfaces";

@Injectable({
  providedIn: "root"
})
export class ProjectsService {
  private projects = new BehaviorSubject<Project[]>([]);
  getProjects = this.projects.asObservable();
  url = baseUrl + "/projects/";

  constructor(private http: HttpClient) {}

  createProject(project: ProjectNew) {
    return this.http
      .post<Project>(this.url, project)
      .pipe(tap(newProject => this.addOneProject(newProject)));
  }

  retrieveProjects() {
    return this.http
      .get<Project[]>(this.url)
      .pipe(tap(projects => this.setProjects(projects)));
  }

  retrieveProjectDetail(organizationSlug: string, projectSlug: string) {
    const url = `${this.url}${organizationSlug}/${projectSlug}/`;
    return this.http.get<Project>(url);
  }

  deleteProject(id: number) {
    const url = `${this.url}/${id}/`;
    return this.http.delete(url);
  }

  setProjects(projects: Project[]) {
    this.projects.next(projects);
  }

  private addOneProject(project: Project) {
    const newProjects = this.projects.getValue().concat([project]);
    this.projects.next(newProjects);
  }
}

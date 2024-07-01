import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { APIBaseService } from "../api-base.service";
import { baseUrl } from "../../constants";
import { Project, ProjectDetail, ProjectNew } from "./projects-api.interfaces";
import { normalizeID } from "../shared-api.utils";

@Injectable({
  providedIn: "root",
})
export class ProjectsAPIService extends APIBaseService {
  readonly url = "/projects/";
  readonly listUrl = `${baseUrl}${this.url}`;

  constructor(protected http: HttpClient) {
    super(http);
  }

  list() {
    let httpParams = new HttpParams();
    httpParams = httpParams.set("limit", 200);
    return this.http
      .get<Project[]>(this.listURL(), { params: httpParams })
      .pipe(
        map((projects) => {
          projects.map((project) => (project.id = normalizeID(project.id)));
          return projects;
        })
      );
  }

  retrieve(organizationSlug: string, projectSlug: string) {
    return this.http
      .get<ProjectDetail>(this.detailURL(organizationSlug, projectSlug))
      .pipe(
        map((projectDetail) => {
          projectDetail.id = normalizeID(projectDetail.id);
          return projectDetail;
        })
      );
  }

  update(
    organizationSlug: string,
    projectSlug: string,
    data: Partial<Project>
  ) {
    return this.http
      .put<ProjectDetail>(this.detailURL(organizationSlug, projectSlug), data)
      .pipe(
        map((projectDetail) => {
          projectDetail.id = normalizeID(projectDetail.id);
          return projectDetail;
        })
      );
  }

  create(project: ProjectNew, teamSlug: string, orgSlug: string) {
    const url = `${baseUrl}/teams/${orgSlug}/${teamSlug}/projects/`;
    return this.http.post<ProjectDetail>(url, project).pipe(
      map((projectDetail) => {
        projectDetail.id = normalizeID(projectDetail.id);
        return projectDetail;
      })
    );
  }

  destroy(organizationSlug: string, projectSlug: string) {
    return this.http.delete(this.detailURL(organizationSlug, projectSlug));
  }

  private listURL() {
    return `${baseUrl}${this.url}`;
  }

  protected detailURL(organizationSlug: string, projectSlug: string) {
    return `${this.listURL()}${organizationSlug}/${projectSlug}/`;
  }
}

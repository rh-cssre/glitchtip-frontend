import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { APIBaseService } from "../api-base.service";
import { baseUrl } from "../../constants";
import {
  APIProject,
  APIProjectDetail,
  Project,
  ProjectNew,
} from "./projects-api.interfaces";
import { detailIdsToIntPipe } from "./projects-api.utils";

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
      .get<APIProject[]>(this.listURL(), { params: httpParams })
      .pipe(
        map((apiProjects) => {
          const projects = apiProjects.map((project) => {
            return {
              ...project,
              id: parseInt(project.id, 10),
            };
          });
          return projects as Project[];
        })
      );
  }

  retrieve(organizationSlug: string, projectSlug: string) {
    return detailIdsToIntPipe(
      this.http.get<APIProjectDetail>(
        this.detailURL(organizationSlug, projectSlug)
      )
    );
  }

  update(
    organizationSlug: string,
    projectSlug: string,
    data: Partial<Project>
  ) {
    return detailIdsToIntPipe(
      this.http.put<APIProjectDetail>(
        this.detailURL(organizationSlug, projectSlug),
        data
      )
    );
  }

  create(project: ProjectNew, teamSlug: string, orgSlug: string) {
    const url = `${baseUrl}/teams/${orgSlug}/${teamSlug}/projects/`;
    return detailIdsToIntPipe(this.http.post<APIProjectDetail>(url, project));
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

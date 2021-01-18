import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { baseUrl } from "../../../constants";
import { APIBaseService } from "../../api-base.service";
import {
  Project,
  ProjectDetail,
  ProjectNew,
} from "../../projects/projects.interfaces";

/**
 * Alerts viewSet nested under organizations ViewSet
 * /api/0/organizations/organization-slug/projects/project-slug/
 */
@Injectable({
  providedIn: "root",
})
export class ProjectByOrgAPIService extends APIBaseService {
  readonly url = baseUrl + "/organizations/";
  constructor(protected http: HttpClient) {
    super(http);
  }

  list(
    organizationSlug?: string,
    cursor?: string,
    query?: string,
    project?: string[] | null,
    start?: string,
    end?: string
  ) {
    const url = organizationSlug ? this.listURL(organizationSlug) : this.url;
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    if (query) {
      httpParams = httpParams.set("query", query);
    }
    if (project) {
      project.forEach((id) => {
        httpParams = httpParams.append("project", id);
      });
    }
    if (start && end) {
      httpParams = httpParams.set("start", start);
      httpParams = httpParams.set("end", end);
    }
    return this.http.get<Project[]>(url, {
      observe: "response",
      params: httpParams,
    });
  }

  retrieve(organizationSlug: string, projectSlug: string) {
    return this.http.get<ProjectDetail>(
      this.detailURL(organizationSlug, projectSlug)
    );
  }

  create(newProjectAlert: ProjectNew, organizationSlug: string) {
    return this.http.post<ProjectDetail>(
      this.listURL(organizationSlug),
      newProjectAlert
    );
  }

  destroy(organizationSlug: string, projectSlug: string) {
    return this.http.delete(this.detailURL(organizationSlug, projectSlug));
  }

  update(
    projectAlert: ProjectNew,
    organizationSlug: string,
    projectSlug: string
  ) {
    return this.http.put<ProjectDetail>(
      this.detailURL(organizationSlug, projectSlug),
      projectAlert
    );
  }

  protected listURL(organizationSlug: string) {
    return `${this.url}${organizationSlug}/projects/`;
  }

  protected detailURL(organizationSlug: string, projectSlug: string) {
    return this.listURL(organizationSlug) + "/" + projectSlug + "/";
  }
}

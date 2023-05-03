import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIBaseService } from "../api-base.service";
import { baseUrl } from "../../constants";
import { Project, ProjectDetail, ProjectNew } from "./projects-api.interfaces";
import { ProjectEnvironment } from "../organizations/organizations.interface";

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
    return this.http.get<Project[]>(this.listURL());
  }

  retrieve(organizationSlug: string, projectSlug: string) {
    return this.http.get<ProjectDetail>(
      this.detailURL(organizationSlug, projectSlug)
    );
  }

  update(
    organizationSlug: string,
    projectSlug: string,
    data: Partial<Project>
  ) {
    return this.http.put<ProjectDetail>(
      this.detailURL(organizationSlug, projectSlug),
      data
    );
  }

  create(project: ProjectNew, teamSlug: string, orgSlug: string) {
    const url = `${baseUrl}/teams/${orgSlug}/${teamSlug}/projects/`;
    return this.http.post<ProjectDetail>(url, project);
  }

  destroy(organizationSlug: string, projectSlug: string) {
    return this.http.delete(this.detailURL(organizationSlug, projectSlug));
  }

  listEnvironments(organizationSlug: string, projectSlug: string) {
    return this.http.get<ProjectEnvironment[]>(
      this.projectEnvironmentsURL(organizationSlug, projectSlug)
    );
  }

  updateEnvironment(
    organizationSlug: string,
    projectSlug: string,
    environment: ProjectEnvironment
  ) {
    return this.http.put<ProjectEnvironment>(
      this.projectEnvironmentsURL(
        organizationSlug,
        projectSlug,
        environment.name
      ),
      environment
    );
  }

  private projectEnvironmentsURL(
    organizationSlug: string,
    projectSlug: string,
    name?: string
  ) {
    return `${baseUrl}${
      this.url
    }${organizationSlug}/${projectSlug}/environments/${
      name ? encodeURIComponent(name) + "/" : ""
    }`;
  }

  private listURL() {
    return `${baseUrl}${this.url}`;
  }

  protected detailURL(organizationSlug: string, projectSlug: string) {
    return `${this.listURL()}${organizationSlug}/${projectSlug}/`;
  }
}

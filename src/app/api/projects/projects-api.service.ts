import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIBaseService } from "../api-base.service";
import { baseUrl } from "../../constants";
import { Project, ProjectDetail, ProjectNew } from "./projects-api.interfaces";
import { ProjectEnvironment } from "../organizations/organizations.interface";

@Injectable({
  providedIn: "root",
})
export class ProjectsAPIService extends APIBaseService {
  readonly url = baseUrl + "/projects/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  /**
   * @param organizationSlug Optional filter by organization slug
   * @param query Optional query filter
   */
  list(organizationSlug?: string, query?: string) {
    let params = new HttpParams();
    if (query) {
      params = params.append("query", query);
    }
    const url = this.listURL(organizationSlug);
    return this.http.get<Project[]>(url, { params });
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
    return this.http.post<Project>(url, project);
  }

  destroy(organizationSlug: string, projectSlug: string) {
    return this.http.delete(this.detailURL(organizationSlug, projectSlug));
  }

  addProjectToTeam(
    organizationSlug: string,
    teamSlug: string,
    projectSlug: string
  ) {
    return this.http.post<Project>(
      this.projectTeamsURL(organizationSlug, teamSlug, projectSlug),
      null
    );
  }

  removeProjectFromTeam(
    organizationSlug: string,
    teamSlug: string,
    projectSlug: string
  ) {
    return this.http.delete<Project>(
      this.projectTeamsURL(organizationSlug, teamSlug, projectSlug)
    );
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

  private projectTeamsURL(
    organizationSlug: string,
    teamSlug: string,
    projectSlug: string
  ) {
    return `${this.url}${organizationSlug}/${projectSlug}/teams/${teamSlug}/`;
  }

  private projectEnvironmentsURL(
    organizationSlug: string,
    projectSlug: string,
    name?: string
  ) {
    return `${this.url}${organizationSlug}/${projectSlug}/environments/${
      name ? encodeURIComponent(name) + "/" : ""
    }`;
  }

  private listURL(organizationSlug?: string) {
    if (organizationSlug) {
      return `${baseUrl}/organizations/${organizationSlug}/projects/`;
    }
    return this.url;
  }

  protected detailURL(organizationSlug: string, projectSlug: string) {
    return `${this.listURL(organizationSlug)}${projectSlug}/`;
  }
}

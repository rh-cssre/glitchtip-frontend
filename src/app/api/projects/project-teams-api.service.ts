import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { ProjectDetail } from "./projects-api.interfaces";

@Injectable({
  providedIn: "root",
})
export class ProjectTeamsAPIService {
  constructor(protected http: HttpClient) {}

  addProjectToTeam(
    organizationSlug: string,
    teamSlug: string,
    projectSlug: string
  ) {
    return this.http.post<ProjectDetail>(
      this.projectTeamsURL(organizationSlug, teamSlug, projectSlug),
      null
    );
  }

  removeProjectFromTeam(
    organizationSlug: string,
    teamSlug: string,
    projectSlug: string
  ) {
    return this.http.delete<ProjectDetail>(
      this.projectTeamsURL(organizationSlug, teamSlug, projectSlug)
    );
  }

  private projectTeamsURL(
    organizationSlug: string,
    teamSlug: string,
    projectSlug: string
  ) {
    return `${baseUrl}/projects/${organizationSlug}/${projectSlug}/teams/${teamSlug}/`;
  }
}

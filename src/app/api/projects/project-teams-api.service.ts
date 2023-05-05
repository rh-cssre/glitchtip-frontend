import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { APIProjectDetail } from "./projects-api.interfaces";
import { detailIdsToIntPipe } from "./projects-api.utils";

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
    return detailIdsToIntPipe(
      this.http.post<APIProjectDetail>(
        this.projectTeamsURL(organizationSlug, teamSlug, projectSlug),
        null
      )
    );
  }

  removeProjectFromTeam(
    organizationSlug: string,
    teamSlug: string,
    projectSlug: string
  ) {
    return detailIdsToIntPipe(
      this.http.delete<APIProjectDetail>(
        this.projectTeamsURL(organizationSlug, teamSlug, projectSlug)
      )
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

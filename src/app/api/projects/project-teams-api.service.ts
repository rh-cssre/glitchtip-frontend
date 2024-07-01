import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { baseUrl } from "../../constants";
import { ProjectDetail } from "./projects-api.interfaces";
import { normalizeID } from "../shared-api.utils";

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
    return this.http
      .post<ProjectDetail>(
        this.projectTeamsURL(organizationSlug, teamSlug, projectSlug),
        null
      )
      .pipe(
        map((projectDetail) => {
          projectDetail.id = normalizeID(projectDetail.id);
          return projectDetail;
        })
      );
  }

  removeProjectFromTeam(
    organizationSlug: string,
    teamSlug: string,
    projectSlug: string
  ) {
    return this.http
      .delete<ProjectDetail>(
        this.projectTeamsURL(organizationSlug, teamSlug, projectSlug)
      )
      .pipe(
        map((projectDetail) => {
          projectDetail.id = normalizeID(projectDetail.id);
          return projectDetail;
        })
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

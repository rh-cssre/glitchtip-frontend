import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { ProjectEnvironment } from "../organizations/organizations.interface";

@Injectable({
  providedIn: "root",
})
export class ProjectEnvironmentsAPIService {
  constructor(protected http: HttpClient) {}

  list(organizationSlug: string, projectSlug: string) {
    return this.http.get<ProjectEnvironment[]>(
      this.projectEnvironmentsURL(organizationSlug, projectSlug) +
        `?visibility=all`
    );
  }

  update(
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
    return `${baseUrl}/projects/${organizationSlug}/${projectSlug}/environments/${
      name ? encodeURIComponent(name) + "/" : ""
    }`;
  }
}

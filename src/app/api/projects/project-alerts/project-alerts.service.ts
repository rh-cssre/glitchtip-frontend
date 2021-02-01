import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NewProjectAlert, ProjectAlert } from "./project-alerts.interface";
import { baseUrl } from "../../../constants";
import { APIBaseService } from "../../api-base.service";

/**
 * Alerts viewSet nested under projects ViewSet
 * /api/0/projects/organization-slug/project-slug/alerts/
 */
@Injectable({
  providedIn: "root",
})
export class ProjectAlertsAPIService extends APIBaseService {
  readonly url = baseUrl + "/projects/";
  constructor(protected http: HttpClient) {
    super(http);
  }

  list(organizationSlug: string, projectSlug: string) {
    return this.http.get<ProjectAlert[]>(
      this.listURL(organizationSlug, projectSlug)
    );
  }

  retrieve(id: string, organizationSlug: string, projectSlug: string) {
    return this.http.get<ProjectAlert>(
      this.detailURL(id, organizationSlug, projectSlug)
    );
  }

  create(
    newProjectAlert: NewProjectAlert,
    organizationSlug: string,
    projectSlug: string
  ) {
    return this.http.post<ProjectAlert>(
      this.listURL(organizationSlug, projectSlug),
      newProjectAlert
    );
  }

  destroy(id: string, organizationSlug: string, projectSlug: string) {
    return this.http.delete(this.detailURL(id, organizationSlug, projectSlug));
  }

  update(
    id: string,
    projectAlert: NewProjectAlert,
    organizationSlug: string,
    projectSlug: string
  ) {
    return this.http.put<ProjectAlert>(
      this.detailURL(id, organizationSlug, projectSlug),
      projectAlert
    );
  }

  protected listURL(organizationSlug: string, projectSlug: string) {
    return `${this.url}${organizationSlug}/${projectSlug}/alerts/`;
  }

  protected detailURL(
    id: string,
    organizationSlug: string,
    projectSlug: string
  ) {
    return this.listURL(organizationSlug, projectSlug) + id + "/";
  }
}

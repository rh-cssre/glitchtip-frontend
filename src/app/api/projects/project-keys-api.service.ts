import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIBaseService } from "../api-base.service";
import { baseUrl } from "../../constants";
import { ProjectKey } from "./projects-api.interfaces";

@Injectable({
  providedIn: "root",
})
export class ProjectKeysAPIService extends APIBaseService {
  readonly url = `${baseUrl}/projects/`;
  constructor(protected http: HttpClient) {
    super(http);
  }

  list(organizationSlug: string, projectSlug: string) {
    return this.http.get<ProjectKey[]>(
      this.listURL(organizationSlug, projectSlug)
    );
  }

  retrieve(organizationSlug: string, projectSlug: string, id: string) {
    return this.http.get<ProjectKey>(
      this.detailURL(organizationSlug, projectSlug, id)
    );
  }

  destroy(organizationSlug: string, projectSlug: string, id: string) {
    return this.http.delete(this.detailURL(organizationSlug, projectSlug, id));
  }

  private listURL(organizationSlug: string, projectSlug: string) {
    return `${this.url}${organizationSlug}/${projectSlug}/keys/`;
  }

  protected detailURL(
    organizationSlug: string,
    projectSlug: string,
    id: string
  ) {
    return `${this.listURL(
      organizationSlug,
      projectSlug
    )}${projectSlug}/${id}/`;
  }
}

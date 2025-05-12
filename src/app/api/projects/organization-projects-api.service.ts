import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map } from "rxjs";
import { baseUrl } from "../../constants";
import { OrganizationProject } from "./projects-api.interfaces";
import { normalizeID } from "../shared-api.utils";

@Injectable({
  providedIn: "root",
})
export class OrganizationProjectsAPIService {
  protected http = inject(HttpClient);

  readonly url = "/projects/";

  list(organizationSlug: string, query?: string) {
    let params = new HttpParams();
    if (query) {
      params = params.append("query", query);
    }
    const url = this.listURL(organizationSlug);
    return this.http.get<OrganizationProject[]>(url, { params }).pipe(
      map((orgProjects) => {
        orgProjects.map((project) => (project.id = normalizeID(project.id)));
        return orgProjects;
      }),
    );
  }

  private listURL(organizationSlug?: string) {
    return `${baseUrl}/organizations/${organizationSlug}${this.url}`;
  }
}

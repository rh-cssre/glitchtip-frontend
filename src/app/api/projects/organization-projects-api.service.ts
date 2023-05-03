import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { OrganizationProject } from "./projects-api.interfaces";

@Injectable({
  providedIn: "root",
})
export class OrganizationProjectsAPIService {
  readonly url = "/projects/";

  constructor(protected http: HttpClient) {}

  list(organizationSlug: string, query?: string) {
    let params = new HttpParams();
    if (query) {
      params = params.append("query", query);
    }
    const url = this.listURL(organizationSlug);
    return this.http.get<OrganizationProject[]>(url, { params });
  }

  private listURL(organizationSlug?: string) {
    return `${baseUrl}/organizations/${organizationSlug}${this.url}`;
  }
}

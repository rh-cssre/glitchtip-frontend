import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIBaseService } from "../api-base.service";
import { baseUrl } from "../../constants";
import { Environment } from "../organizations/organizations.interface";

@Injectable({
  providedIn: "root",
})
export class EnvironmentsAPIService extends APIBaseService {
  readonly url = "/environments/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  retrieve(id: string, organizationSlug: string) {
    return this.http.get<Environment>(this.detailURL(organizationSlug, id));
  }

  list(organizationSlug: string) {
    return this.http.get<Environment[]>(this.listURL(organizationSlug));
  }

  protected listURL(organizationSlug: string) {
    return `${baseUrl}/organizations/${organizationSlug}${this.url}`;
  }

  protected detailURL(organizationSlug: string, id: string) {
    return `${this.listURL(organizationSlug)}${id}/`;
  }
}

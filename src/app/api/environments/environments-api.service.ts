import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { APIBaseService } from "../api-base.service";
import { baseUrl } from "../../constants";
import { Environment } from "../organizations/organizations.interface";

@Injectable({
  providedIn: "root",
})
export class EnvironmentsAPIService extends APIBaseService {
  protected http: HttpClient;

  readonly url = "/environments/";

  constructor() {
    const http = inject(HttpClient);

    super(http);
  
    this.http = http;
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

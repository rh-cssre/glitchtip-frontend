import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Organization,
  OrganizationDetail,
  OrganizationNew,
  Environment,
} from "./organizations.interface";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";

@Injectable({
  providedIn: "root",
})
export class OrganizationAPIService extends APIBaseService {
  readonly url = baseUrl + "/organizations/";
  constructor(protected http: HttpClient) {
    super(http);
  }

  list() {
    return this.http.get<Organization[]>(this.url);
  }

  retrieve(id: string) {
    return this.http.get<OrganizationDetail>(this.detailURL(id));
  }

  create(obj: OrganizationNew) {
    return this.http.post<OrganizationDetail>(this.url, obj);
  }

  update(id: string, obj: OrganizationNew) {
    return this.http.put<OrganizationDetail>(this.detailURL(id), obj);
  }

  destroy(id: string) {
    return this.http.delete(this.detailURL(id));
  }

  retrieveOrganizationEnvironments(orgSlug: string) {
    const url = `${baseUrl}/organizations/${orgSlug}/environments/`;
    return this.http.get<Environment[]>(url);
  }
}

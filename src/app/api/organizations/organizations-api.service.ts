import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import {
  APIOrganizationDetail,
  Organization,
  OrganizationDetail,
  OrganizationNew,
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
    return this.http.get<APIOrganizationDetail>(this.detailURL(id)).pipe(
      map((apiOrgDetail) => {
        const projects = apiOrgDetail.projects.map((project) => ({
          ...project,
          id: parseInt(project.id, 10),
        }));
        return {
          ...apiOrgDetail,
          projects,
        } as OrganizationDetail;
      })
    );
  }

  create(obj: OrganizationNew) {
    return this.http.post<Organization>(this.url, obj);
  }

  update(id: string, obj: OrganizationNew) {
    return this.http.put<Organization>(this.detailURL(id), obj);
  }

  destroy(id: string) {
    return this.http.delete(this.detailURL(id));
  }
}

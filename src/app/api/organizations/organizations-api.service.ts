import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import {
  Organization,
  OrganizationDetail,
  OrganizationNew,
  OrganizationProject,
} from "./organizations.interface";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";

interface APIOrganizationProject extends Omit<OrganizationProject, "id"> {
  id: string;
}

interface APIOrganizationDetail extends Omit<OrganizationDetail, "projects"> {
  projects: APIOrganizationProject[];
}

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
    return this.http.post<OrganizationDetail>(this.url, obj);
  }

  update(id: string, obj: OrganizationNew) {
    return this.http.put<OrganizationDetail>(this.detailURL(id), obj);
  }

  destroy(id: string) {
    return this.http.delete(this.detailURL(id));
  }
}

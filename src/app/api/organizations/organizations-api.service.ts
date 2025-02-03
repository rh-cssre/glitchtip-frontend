import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import {
  Organization,
  OrganizationDetail,
  OrganizationNew,
} from "./organizations.interface";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";
import { normalizeID } from "../shared-api.utils";

@Injectable({
  providedIn: "root",
})
export class OrganizationAPIService extends APIBaseService {
  protected http: HttpClient;

  readonly url = baseUrl + "/organizations/";
  constructor() {
    const http = inject(HttpClient);

    super(http);
  
    this.http = http;
  }

  list() {
    return this.http.get<Organization[]>(this.url);
  }

  retrieve(id: string) {
    return this.http.get<OrganizationDetail>(this.detailURL(id)).pipe(
      map((orgDetail) => {
        orgDetail.projects.map((project) => {
          project.id = normalizeID(project.id);
        });
        return orgDetail;
      })
    );
  }

  create(obj: OrganizationNew) {
    return this.http.post<Organization>(this.url, obj);
  }

  update(id: string, obj: OrganizationNew) {
    return this.http.put<Organization>(this.detailURL(id), obj);
  }
}

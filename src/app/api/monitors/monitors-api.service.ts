import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { HttpClient, HttpParams } from "@angular/common/http";
import { APIBaseService } from "../api-base.service";
import { Monitor } from "src/app/uptime/uptime.interfaces";

@Injectable({
  providedIn: "root"
})
export class MonitorsAPIService extends APIBaseService {
  readonly url = baseUrl + "/monitors/";
  constructor(protected http: HttpClient) {
    super(http);
  }

  list(organizationSlug?: string, cursor?: string) {
    let httpParams = new HttpParams();
    const url = organizationSlug
      ? `${baseUrl}/organizations/${organizationSlug}/monitors/`
      : this.url;
      if (cursor) {
        httpParams = httpParams.set("cursor", cursor);
      }
      return this.http.get<Monitor[]>(url, {
        observe: "response",
        params: httpParams,
      });
  }

  retrieve(id: string) {
    return this.http.get<Monitor>(this.detailURL(id));
  }

  destroy(id: string) {
    return this.http.delete(this.detailURL(id));
  }
}

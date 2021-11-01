import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { HttpClient, HttpParams } from "@angular/common/http";
import { APIBaseService } from "../api-base.service";
import { Monitor, NewMonitor } from "src/app/uptime/uptime.interfaces";

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
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    return this.http.get<Monitor[]>(
      this.listURL(organizationSlug), {
      observe: "response",
      params: httpParams,
    });
  }

  createMonitor(organizationSlug: string, data: NewMonitor) {
    console.log("sending")
    return this.http.post<Monitor>(this.listURL(organizationSlug), data)
  }

  retrieve(id: string) {
    return this.http.get<Monitor>(this.detailURL(id));
  }

  destroy(id: string) {
    return this.http.delete(this.detailURL(id));
  }

  protected listURL(organizationSlug?: string) {
    return `${baseUrl}/organizations/${organizationSlug}/monitors/`;
  }
}



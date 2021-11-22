import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { HttpClient, HttpParams } from "@angular/common/http";
import { APIBaseService } from "../api-base.service";
import { MonitorDetail, NewMonitor } from "src/app/uptime/uptime.interfaces";

@Injectable({
  providedIn: "root"
})
export class MonitorsAPIService extends APIBaseService {
  readonly url = baseUrl + "/monitors/";
  constructor(protected http: HttpClient) {
    super(http);
  }

  list(organizationSlug: string, cursor?: string) {
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    return this.http.get<MonitorDetail[]>(
      this.listURL(organizationSlug), {
      observe: "response",
      params: httpParams,
    });
  }

  createMonitor(organizationSlug: string, data: NewMonitor) {
    return this.http.post<MonitorDetail>(this.listURL(organizationSlug), data);
  }

  retrieve(organizationSlug: string, monitorId: string) {
    return this.http.get<MonitorDetail>(this.detailURL(organizationSlug, monitorId));
  }

  destroy(organizationSlug: string, monitorId: string) {
    return this.http.delete(this.detailURL(organizationSlug, monitorId));
  }

  update(
    organizationSlug: string,
    monitorId: string,
    data: Partial<MonitorDetail>
  ) {
    return this.http.put<MonitorDetail>(
      this.detailURL(organizationSlug, monitorId),
      data
    );
  }

  protected listURL(organizationSlug: string) {
    return `${baseUrl}/organizations/${organizationSlug}/monitors/`;
  }

  protected detailURL(
    organizationSlug: string,
    monitorId: string
  ) {
    return `${this.listURL(organizationSlug)}${monitorId}/`;
  }
}





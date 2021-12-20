import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { baseUrl } from "../../constants";
import { MonitorCheck } from "src/app/uptime/uptime.interfaces";

@Injectable({
  providedIn: "root",
})
export class MonitorChecksAPIService {
  constructor(private http: HttpClient) {}

  list(organizationSlug: string, monitorId: string, cursor?: string) {
    let httpParams = new HttpParams();
    const url = `${baseUrl}/organizations/${organizationSlug}/monitors/${monitorId}/checks/`;
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    return this.http.get<MonitorCheck[]>(url, {
      observe: "response",
      params: httpParams,
    });
  }
}

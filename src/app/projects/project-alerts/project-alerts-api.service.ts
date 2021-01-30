import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { baseUrl } from "../../constants";

interface ProjectAlerts {
  pk: number;
  timespan_minutes: number;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class ProjectAlertsAPIService {
  private readonly url = baseUrl + "/projects/";

  constructor(private http: HttpClient) {}

  retrieve(id: string) {
    return this.http.get<ProjectAlerts[]>(this.detailURL(id));
  }

  private detailURL(id: string) {
    return this.url + id + "/";
  }
}

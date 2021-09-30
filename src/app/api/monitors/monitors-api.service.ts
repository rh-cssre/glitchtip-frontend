import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants";
import { HttpClient } from "@angular/common/http";
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

  list(organizationSlug?: string) {
    const url = organizationSlug
      ? `${baseUrl}/organizations/${organizationSlug}/monitors/`
      : this.url;

      return this.http.get<Monitor[]>(url, {
        observe: "response",
      });
  }

  retrieve(id: string) {
    return this.http.get<Monitor>(this.detailURL(id));
  }

  destroy(id: string) {
    return this.http.delete(this.detailURL(id));
  }
}

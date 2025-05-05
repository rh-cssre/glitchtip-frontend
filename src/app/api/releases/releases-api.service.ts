import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { baseUrl } from "src/app/constants";
import { APIBaseService } from "../api-base.service";
import { Release, ReleaseFile } from "./releases.interfaces";

@Injectable({
  providedIn: "root",
})
export class ReleasesAPIService extends APIBaseService {
  protected http: HttpClient;

  readonly url = "/releases/";
  constructor() {
    const http = inject(HttpClient);

    super(http);

    this.http = http;
  }

  list(organizationSlug: string, cursor?: string | null) {
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    return this.http.get<Release[]>(this.listURL(organizationSlug), {
      observe: "response",
      params: httpParams,
    });
  }

  retrieve(organizationSlug: string, version: string) {
    return this.http.get<Release>(this.detailURL(organizationSlug, version));
  }

  listReleaseFiles(
    organizationSlug: string,
    version: string,
    cursor?: string | null,
  ) {
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    return this.http.get<ReleaseFile[]>(
      `${this.detailURL(organizationSlug, version)}files/`,
      {
        observe: "response",
        params: httpParams,
      },
    );
  }

  protected listURL(organizationSlug: string) {
    return `${baseUrl}/organizations/${organizationSlug}${this.url}`;
  }

  protected detailURL(organizationSlug: string, version: string) {
    return `${this.listURL(organizationSlug)}${version}/`;
  }
}

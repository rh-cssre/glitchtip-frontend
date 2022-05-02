import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { TransactionGroup } from "./transactions.interfaces";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";

@Injectable({
  providedIn: "root",
})
export class TransactionGroupsAPIService extends APIBaseService {
  readonly url = "/transaction-groups/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  list(
    organizationSlug: string,
    cursor?: string,
    project?: string[] | null,
    start?: string,
    end?: string,
    sort?: string,
    environment?: string,
    query?: string
  ) {
    const url = this.listURL(organizationSlug);
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    if (project) {
      project.forEach((id) => {
        httpParams = httpParams.append("project", id);
      });
    }
    if (start) {
      httpParams = httpParams.set("start", start);
    }
    if (end) {
      httpParams = httpParams.set("end", end);
    }
    if (sort) {
      httpParams = httpParams.set("sort", sort);
    }
    if (environment) {
      httpParams = httpParams.append("environment", environment);
    }
    if (query) {
      httpParams = httpParams.append("query", query);
    }
    return this.http.get<TransactionGroup[]>(url, {
      observe: "response",
      params: httpParams,
    });
  }

  retrieve(id: number, organizationSlug: string) {
    return this.http.get<TransactionGroup>(
      this.detailURL(id, organizationSlug)
    );
  }

  protected listURL(organizationSlug: string) {
    return `${baseUrl}/organizations/${organizationSlug}${this.url}`;
  }

  protected detailURL(id: number, organizationSlug: string) {
    return `${this.listURL(organizationSlug)}${id}/`;
  }
}

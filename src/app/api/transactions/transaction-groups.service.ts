import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { TransactionGroup } from "./transactions.interfaces";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";

@Injectable({
  providedIn: "root",
})
export class TransactionGroupsService extends APIBaseService {
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
  ) {
    const url = this.listURL(organizationSlug)
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    if (project) {
      project.forEach((id) => {
        httpParams = httpParams.append("project", id);
      });
    }
    if (start && end) {
      httpParams = httpParams.set("start", start);
      httpParams = httpParams.set("end", end);
    }
    if (sort) {
      httpParams = httpParams.set("sort", sort);
    }
    return this.http.get<TransactionGroup[]>(url, {
      observe: "response",
      params: httpParams,
    });
  }

  retrieve(organizationSlug: string, id: string) {
    return this.http.get<TransactionGroup>(this.detailURL(organizationSlug, id));
  }

  protected listURL(organizationSlug: string) {
    return `${baseUrl}/organizations/${organizationSlug}${this.url}`;
  }

  protected detailURL(organizationSlug: string, id: string) {
    return `${this.listURL(organizationSlug)}${id}/`;
  }
}

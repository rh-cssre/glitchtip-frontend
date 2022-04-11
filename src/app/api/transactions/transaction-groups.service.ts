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

  list(organizationSlug: string, cursor?: string) {
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    return this.http.get<TransactionGroup[]>(this.listURL(organizationSlug), {
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

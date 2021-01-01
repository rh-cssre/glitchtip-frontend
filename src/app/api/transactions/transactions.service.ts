import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Transaction } from "./transactions.interfaces";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";

@Injectable({
  providedIn: "root",
})
export class TransactionsService extends APIBaseService {
  readonly url = "/transactions/";

  constructor(protected http: HttpClient) {
    super(http);
  }

  list(organizationSlug: string) {
    return this.http.get<Transaction[]>(this.listURL(organizationSlug));
  }

  retrieve(organizationSlug: string, id: string) {
    return this.http.get<Transaction>(this.detailURL(organizationSlug, id));
  }

  destroy(organizationSlug: string, id: string) {
    return this.http.delete(this.detailURL(organizationSlug, id));
  }

  protected listURL(organizationSlug: string) {
    return `${baseUrl}/organizations/${organizationSlug}${this.url}`;
  }

  protected detailURL(organizationSlug: string, id: string) {
    return `${this.listURL(organizationSlug)}${id}/`;
  }
}

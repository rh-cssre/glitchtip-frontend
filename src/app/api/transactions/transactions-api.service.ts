import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Transaction, TransactionDetail } from "./transactions.interfaces";
import { baseUrl } from "../../constants";
import { APIBaseService } from "../api-base.service";

@Injectable({
  providedIn: "root",
})
export class TransactionsAPIService extends APIBaseService {
  protected http: HttpClient;

  readonly url = "/transactions/";

  constructor() {
    const http = inject(HttpClient);

    super(http);

    this.http = http;
  }

  list(organizationSlug: string, cursor?: string) {
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    return this.http.get<Transaction[]>(this.listURL(organizationSlug), {
      observe: "response",
      params: httpParams,
    });
  }

  retrieve(organizationSlug: string, id: string) {
    return this.http.get<TransactionDetail>(
      this.detailURL(organizationSlug, id),
    );
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

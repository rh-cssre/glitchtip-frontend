import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { baseUrl } from "../../constants";
import { APIToken, NewAPIToken } from "./api-tokens.interfaces";
import { APIBaseService } from "../api-base.service";

@Injectable({
  providedIn: "root",
})
export class APITokenService extends APIBaseService {
  readonly url = baseUrl + "/api-tokens/";
  constructor(protected http: HttpClient) {
    super(http);
  }

  list() {
    return this.http.get<APIToken[]>(this.url);
  }

  retrieve(id: string) {
    return this.http.get<APIToken>(this.detailURL(id));
  }

  create(newToken: NewAPIToken) {
    return this.http.post<APIToken>(this.url, newToken);
  }

  destroy(id: string) {
    return this.http.delete(this.detailURL(id));
  }
}

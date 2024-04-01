import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SocialAuthAPIService {
  readonly url = `/api/socialaccounts/`;
  constructor(protected http: HttpClient) {}

  disconnect(accountId: number) {
    return this.http.post(`${this.url}${accountId}/disconnect/`, {});
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SocialAuthAPIService {
  protected http = inject(HttpClient);


  disconnect(account: string, provider: string) {
    return this.http.request(
      "delete",
      "/_allauth/browser/v1/account/providers",
      { body: { account, provider } },
    );
  }
}

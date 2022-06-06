import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { LoginResponse } from "../auth/auth.interfaces";
import { getStorageWithExpiry } from "src/app/shared/shared.utils";
import { SocialApp } from "../user/user.interfaces";

interface RestAuthConnectData {
  access_token?: string;
  code?: string;
  tags?: string | null;
}

@Injectable({
  providedIn: "root",
})
export class GlitchTipOAuthService {
  private readonly baseUrl = "rest-auth";

  constructor(private http: HttpClient) {}

  getAnalyticsTags() {
    return getStorageWithExpiry("register");
  }

  completeOAuthLogin(
    provider: string,
    isConnect: boolean,
    accessToken: string | null,
    code: string | null
  ) {
    let data: RestAuthConnectData = {};
    if (accessToken) {
      data = {
        access_token: accessToken,
        tags: this.getAnalyticsTags(),
      };
    } else if (code) {
      data = {
        code,
        tags: this.getAnalyticsTags(),
      };
    }
    let url = this.baseUrl + "/" + provider + "/";
    if (isConnect) {
      url += "connect/";
    }
    return this.http.post<LoginResponse>(url, data);
  }

  // /** Redirect user to OAuth provider auth URL */
  initOAuthLogin(socialApp: SocialApp) {
    const params: Record<string, string> = {
      response_type: "code",
      client_id: socialApp.client_id,
      redirect_uri: window.location.origin + "/auth/" + socialApp.provider,
      scope: socialApp.scopes.join(" "),
    };

    if (socialApp.provider === 'keycloak') {
      const nonce = self.crypto.randomUUID();

      const expire = new Date();
      expire.setUTCMinutes( expire.getUTCMinutes() + 10);

      document.cookie = `keycloak_nonce=${nonce}; expires=${expire}; path=/`;
      params['nonce'] = nonce;
    }

    const urlParams = new URLSearchParams(params);
    const url = `${socialApp.authorize_url}?${urlParams.toString()}`;
    window.location.href = url;
  }
}

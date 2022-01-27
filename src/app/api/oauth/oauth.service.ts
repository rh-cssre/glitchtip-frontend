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

  githubLogin(code: string, isConnect: boolean) {
    const data: RestAuthConnectData = {
      code,
      tags: this.getAnalyticsTags(),
    };
    let url = this.baseUrl + "/github/";
    if (isConnect) {
      url += "connect/";
    }
    return this.http.post<LoginResponse>(url, data);
  }

  microsoftLogin(accessToken: string, isConnect: boolean) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
      tags: this.getAnalyticsTags(),
    };
    let url = this.baseUrl + "/microsoft/";
    if (isConnect) {
      url += "connect/";
    }
    return this.http.post<LoginResponse>(url, data);
  }

  googleLogin(accessToken: string, isConnect: boolean) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
      tags: this.getAnalyticsTags(),
    };
    let url = this.baseUrl + "/google/";
    if (isConnect) {
      url += "connect/";
    }
    return this.http.post<LoginResponse | null>(url, data);
  }

  gitlabLogin(accessToken: string, isConnect: boolean) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
      tags: this.getAnalyticsTags(),
    };
    let url = this.baseUrl + "/gitlab/";
    if (isConnect) {
      url += "connect/";
    }
    return this.http.post<LoginResponse>(url, data);
  }

  // initGitlabLogin(clientId: string, authorizeUrl: string) {
  //   this.initOAuthLogin(clientId, authorizeUrl, "gitlab");
  // }

  // initGithubLogin(clientId: string, authorizeUrl: string) {
  //   this.initOAuthLogin(clientId, authorizeUrl, "github");
  // }

  // initGoogleLogin(clientId: string, authorizeUrl: string) {
  //   this.initOAuthLogin(clientId, authorizeUrl, "google");
  // }

  // initMicrosoftLogin(clientId: string, authorizeUrl: string) {
  //   this.initOAuthLogin(clientId, authorizeUrl, "microsoft");
  // }

  // /** Redirect user to OAuth provider auth URL */
  initOAuthLogin(socialApp: SocialApp) {
      const params = new URLSearchParams({
        response_type: "token",
        client_id: socialApp.client_id,
        redirect_uri: window.location.origin + "/auth/" + socialApp.provider,
        scope: socialApp.scopes.join(" "),
      });
      const url = `${socialApp.authorize_url}?${params.toString()}`;
      window.location.href = url;
    }
  }

// clientId: string, authorizeUrl: string, scopes: string[], provider: OAuthProvider
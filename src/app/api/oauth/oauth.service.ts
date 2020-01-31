import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { OAuthService } from "angular-oauth2-oidc";
import { tap } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import { gitlabAuthConfig } from "./social";

interface RestAuthConnectData {
  access_token: string;
  code?: string;
}

interface RestAuthConnectResp {
  key: string;
}

@Injectable({
  providedIn: "root"
})
export class GlitchTipOAuthService {
  private readonly baseUrl = "rest-auth";

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private oauthService: OAuthService
  ) {}

  gitlabConnect(accessToken: string, code?: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
      code
    };
    const url = this.baseUrl + "/gitlab/";
    return this.http
      .post<RestAuthConnectResp>(url, data)
      .pipe(tap(resp => this.auth.setAuth(resp)));
  }

  initGitlabLogin() {
    this.oauthService.configure(gitlabAuthConfig);
    this.oauthService.initLoginFlow();
  }
}

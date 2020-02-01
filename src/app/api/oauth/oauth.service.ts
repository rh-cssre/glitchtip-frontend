import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { OAuthService } from "angular-oauth2-oidc";
import { tap } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import {
  gitlabAuthConfig,
  googleAuthConfig,
  microsoftAuthConfig,
  githubAuthConfig
} from "./social";

interface RestAuthConnectData {
  access_token?: string;
  code?: string;
}

interface RestAuthLoginResp {
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

  githubLogin(code: string) {
    const data: RestAuthConnectData = {
      code
    };
    const url = this.baseUrl + "/github/";
    return this.http
      .post<RestAuthLoginResp>(url, data)
      .pipe(tap(resp => this.auth.setAuth(resp)));
  }

  microsoftLogin(accessToken: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken
    };
    const url = this.baseUrl + "/microsoft/";
    return this.http
      .post<RestAuthLoginResp>(url, data)
      .pipe(tap(resp => this.auth.setAuth(resp)));
  }

  gitlabLogin(accessToken: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken
    };
    const url = this.baseUrl + "/gitlab/";
    return this.http
      .post<RestAuthLoginResp>(url, data)
      .pipe(tap(resp => this.auth.setAuth(resp)));
  }

  googleLogin(accessToken: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken
    };
    const url = this.baseUrl + "/google/";
    return this.http
      .post<RestAuthLoginResp>(url, data)
      .pipe(tap(resp => this.auth.setAuth(resp)));
  }

  initGitlabLogin() {
    this.oauthService.configure(gitlabAuthConfig);
    this.oauthService.initLoginFlow();
  }

  initGithubLogin() {
    this.oauthService.configure(githubAuthConfig);
    this.oauthService.initLoginFlow();
  }

  initGoogleLogin() {
    this.oauthService.configure(googleAuthConfig);
    this.oauthService.initLoginFlow();
  }

  initMicrosoftLogin() {
    this.oauthService.configure(microsoftAuthConfig);
    this.oauthService.initLoginFlow();
  }
}

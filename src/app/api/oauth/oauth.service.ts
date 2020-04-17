import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { OAuthService } from "angular-oauth2-oidc";
import { tap } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import {
  gitlabAuthConfig,
  googleAuthConfig,
  microsoftAuthConfig,
  githubAuthConfig,
  googleAuthConnectConfig,
  gitlabAuthConnectConfig,
  microsoftAuthConnectConfig,
} from "./social";

interface RestAuthConnectData {
  access_token?: string;
  code?: string;
}

interface RestAuthLoginResp {
  key: string;
}

@Injectable({
  providedIn: "root",
})
export class GlitchTipOAuthService {
  private readonly baseUrl = "rest-auth";

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private oauthService: OAuthService,
    private router: Router
  ) {}

  githubLogin(code: string) {
    const data: RestAuthConnectData = {
      code,
    };
    const url = this.baseUrl + "/github/";
    return this.http
      .post<RestAuthLoginResp>(url, data)
      .pipe(tap((resp) => this.loginSuccess(resp)));
  }

  microsoftLogin(accessToken: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
    };
    const url = this.baseUrl + "/microsoft/";
    return this.http
      .post<RestAuthLoginResp>(url, data)
      .pipe(tap((resp) => this.loginSuccess(resp)));
  }

  microsoftConnect(accessToken: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
    };
    const url = this.baseUrl + "/microsoft/connect/";
    return this.http.post<RestAuthLoginResp>(url, data);
  }

  gitlabLogin(accessToken: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
    };
    const url = this.baseUrl + "/gitlab/";
    return this.http
      .post<RestAuthLoginResp>(url, data)
      .pipe(tap((resp) => this.loginSuccess(resp)));
  }

  gitlabConnect(accessToken: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
    };
    const url = this.baseUrl + "/gitlab/connect/";
    return this.http.post<RestAuthLoginResp>(url, data);
  }

  googleLogin(accessToken: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
    };
    const url = this.baseUrl + "/google/";
    return this.http
      .post<RestAuthLoginResp>(url, data)
      .pipe(tap((resp) => this.loginSuccess(resp)));
  }

  googleConnect(accessToken: string) {
    const data: RestAuthConnectData = {
      access_token: accessToken,
    };
    const url = this.baseUrl + "/google/connect/";
    return this.http.post<RestAuthLoginResp>(url, data);
  }

  initGitlabLogin() {
    this.oauthService.configure(gitlabAuthConfig);
    this.oauthService.initLoginFlow();
  }

  initGitlabConnect() {
    this.oauthService.configure(gitlabAuthConnectConfig);
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

  initGoogleConnect() {
    this.oauthService.configure(googleAuthConnectConfig);
    this.oauthService.initLoginFlow();
  }

  initMicrosoftLogin() {
    this.oauthService.configure(microsoftAuthConfig);
    this.oauthService.initLoginFlow();
  }

  initMicrosoftConnect() {
    this.oauthService.configure(microsoftAuthConnectConfig);
    this.oauthService.initLoginFlow();
  }

  /** On success for any oauth client, set auth data and redirect to home */
  private loginSuccess(resp: RestAuthLoginResp) {
    this.auth.setAuth(resp);
    this.router.navigate([""]);
  }
}

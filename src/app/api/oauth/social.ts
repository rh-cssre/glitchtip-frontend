import { AuthConfig } from "angular-oauth2-oidc";

export const gitlabAuthConfig: AuthConfig = {
  issuer: "https://gitlab.com",
  tokenEndpoint: "https://gitlab.com/oauth/token",
  userinfoEndpoint: "https://gitlab.com/oauth/userinfo",
  responseType: "token",
  loginUrl: "https://gitlab.com/oauth/authorize",
  strictDiscoveryDocumentValidation: false,
  skipIssuerCheck: true,
  oidc: false,
  redirectUri: window.location.origin + "/login/gitlab",
  clientId: "0b6b2912b57032df9a6bd2186bbb394b67083a17fad98ff590ab5c7a9355f118",
  scope: "read_user"
};

export const googleAuthConfig: AuthConfig = {
  issuer: "https://accounts.google.com",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  userinfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
  responseType: "token",
  loginUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  oidc: false,
  redirectUri: window.location.origin + "/login/google",
  silentRefreshRedirectUri: window.location.origin + "/silent-refresh.html",
  clientId:
    "1005454931976-jvjgtjo6kg8skidrkucti86obq5cmjps.apps.googleusercontent.com",
  strictDiscoveryDocumentValidation: false,
  scope: "openid profile email",
  sessionChecksEnabled: true
};

export const microsoftAuthConfig: AuthConfig = {
  issuer: "https://login.microsoftonline.com/common",
  tokenEndpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
  loginUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  responseType: "token",
  scope: "User.Read",
  redirectUri: window.location.origin + "/login/microsoft",
  userinfoEndpoint: "https://graph.microsoft.com/v1.0/me/",
  oidc: false,
  clientId: "47783413-5cc9-4557-a7fc-0033837da5cb"
};

export const githubAuthConfig: AuthConfig = {
  issuer: "https://github.com",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  loginUrl: "https://github.com/login/oauth/authorize",
  userinfoEndpoint: "https://api.github.com/user",
  clientId: "b0152d7ffb6051ea1f9a",
  responseType: "token",
  oidc: false,
  scope: "read:user user:email",
  redirectUri: window.location.origin + "/login/github"
};

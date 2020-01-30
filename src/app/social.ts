import { AuthConfig } from "angular-oauth2-oidc";

export const gitlabAuthConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: "https://gitlab.com",
  tokenEndpoint: "https://gitlab.com/oauth/token",
  userinfoEndpoint: "https://gitlab.com/oauth/userinfo",
  responseType: "token",
  loginUrl: "https://gitlab.com/oauth/authorize",
  strictDiscoveryDocumentValidation: false,
  skipIssuerCheck: true,
  oidc: false,
  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.toString(),

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: "0b6b2912b57032df9a6bd2186bbb394b67083a17fad98ff590ab5c7a9355f118",

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: "read_user"
};

export const googleAuthConfig: AuthConfig = {
  issuer: "https://accounts.google.com",
  redirectUri: window.location.origin + "/index.html",
  silentRefreshRedirectUri: window.location.origin + "/silent-refresh.html",
  clientId: "",
  strictDiscoveryDocumentValidation: false,
  scope: "openid profile email",
  sessionChecksEnabled: true
};

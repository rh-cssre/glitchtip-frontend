import { OAuthConfig, OAuthProvider } from "./oauth.interfaces";

/** Every possible OAuth Config supported */
const oAuthConfigs: OAuthConfig[] = [
  {
    loginURL: "https://gitlab.com/oauth/authorize",
    scope: "read_user",
    name: "gitlab",
  },
  {
    loginURL: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "openid profile email",
    name: "google",
  },
  {
    loginURL: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    scope: "User.Read",
    name: "microsoft",
  },
  {
    loginURL: "https://github.com/login/oauth/authorize",
    scope: "read:user user:email",
    name: "github",
  },
];

export const getOAuthConfig = (provider: OAuthProvider) =>
  oAuthConfigs.find((config) => config.name === provider);

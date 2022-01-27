import { OAuthConfig, OAuthProvider } from "./oauth.interfaces";

/** Every possible OAuth Config supported */
const oAuthConfigs: OAuthConfig[] = [
  {
    scope: "read_user",
    name: "gitlab",
  },
  {
    scope: "openid profile email",
    name: "google",
  },
  {
    scope: "User.Read",
    name: "microsoft",
  },
  {
    scope: "read:user user:email",
    name: "github",
  },
];

export const getOAuthConfig = (provider: OAuthProvider) =>
  oAuthConfigs.find((config) => config.name === provider);

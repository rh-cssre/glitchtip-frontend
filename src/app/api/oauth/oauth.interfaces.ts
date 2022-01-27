/** Name as defined by django-allauth */
export type OAuthProvider = "google" | "gitlab" | "github" | "microsoft";

export interface OAuthConfig {
  scope: string;
  name: OAuthProvider;
}

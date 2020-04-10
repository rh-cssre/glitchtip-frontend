import { OAuthProvider } from "../oauth/oauth.interfaces";

interface SocialAccount {
  id: number;
  provider: OAuthProvider;
  uid: string;
  last_login: string;
  date_joined: string;
}

export interface UserDetails {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  socialaccount_set: SocialAccount[];
}

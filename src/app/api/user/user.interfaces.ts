import { OAuthProvider } from "../oauth/oauth.interfaces";

export interface SocialAccount {
  id: number;
  provider: OAuthProvider;
  uid: string;
  last_login: string;
  date_joined: string;
  email: string;
  username: string | null;
}

export interface SocialApp {
  provider: OAuthProvider;
  name: string;
  client_id: string;
}

export interface User {
  lastLogin: string;
  isSuperuser: boolean;
  identities: SocialAccount[];
  id: number;
  isActive: boolean;
  name: string;
  dateJoined: string;
  hasPasswordAuth: boolean;
  email: string;
}

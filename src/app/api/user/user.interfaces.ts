import { OAuthProvider } from "../oauth/oauth.interfaces";

interface SocialAccount {
  id: number;
  provider: OAuthProvider;
  uid: string;
  last_login: string;
  date_joined: string;
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

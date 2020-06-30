import { OAuthProvider } from "../oauth/oauth.interfaces";

interface SocialAccount {
  id: number;
  provider: OAuthProvider;
  uid: string;
  last_login: string;
  date_joined: string;
}

// TODO: Update with interface from /api/0/users/me/
export interface UserDetails {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  socialaccount_set: SocialAccount[];
}

export interface EmailAddress {
  isPrimary: boolean;
  email: string;
  isVerified: boolean;
}

export interface User {
  lastLogin: string;
  isSuperuser: boolean;
  identities: [];
  id: number;
  isActive: boolean;
  name: string;
  dateJoined: string;
  hasPasswordAuth: boolean;
  email: string;
}

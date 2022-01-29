import { OAuthProvider } from "../oauth/oauth.interfaces";
import { Avatar } from "../organizations/organizations.interface";

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
  authorize_url: string;
  scopes: string[];
}

export interface User {
  username: string;
  lastLogin: string;
  isSuperuser: boolean;
  emails: Email[];
  isManaged: boolean;
  lastActive: string;
  identities: SocialAccount[];
  id: string;
  isActive: boolean;
  has2fa: boolean;
  canReset2fa: boolean;
  name: string;
  avatarUrl: string;
  authenticators: [];
  dateJoined: string;
  options: UserOptions;
  flags: object;
  avatar: Avatar;
  hasPasswordAuth: boolean;
  permissions: [];
  email: string;
}

interface Email {
  is_verified: boolean;
  id: string;
  email: string;
}

interface UserOptions {
  timezone: string;
  stacktraceOrder: number;
  language: string;
  clock24Hours: boolean;
}

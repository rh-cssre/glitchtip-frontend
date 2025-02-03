import { components } from "../api-schema";
import { Avatar } from "../organizations/organizations.interface";

type UserOptions = components["schemas"]["UserOptions"];

export interface SocialAccount {
  id: number;
  provider: string;
  uid: string;
  last_login: string;
  date_joined: string;
  email: string;
  username: string | null;
}

export interface SocialApp {
  provider: string;
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
  chatwootIdentifierHash: string | null;
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

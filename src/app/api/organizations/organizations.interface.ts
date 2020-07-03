import { User } from "../user/user.interfaces";
import { Team } from "../teams/teams.interfaces";

export interface OrganizationNew {
  name: string;
  slug: string;
}

export interface Organization extends OrganizationNew {
  id: number;
  dateCreated: string;
  status: OrgStatus;
  avatar: Avatar;
  isEarlyAdopter: boolean;
  require2FA: boolean;
  isAcceptingEvents: boolean;
}

// tslint:disable-next-line:no-empty-interface
export interface OrganizationDetail extends Organization {
  projects: OrganizationProject[];
  teams: Team[];
}

interface OrgStatus {
  id: string;
  name: string;
}

export interface Avatar {
  avatarType: string;
  avatarUuid: string | null;
}

export interface OrganizationProject {
  name: string;
  slug: string;
  platform: string | null;
  id: number;
  isMember: boolean;
}

export interface Member {
  role: string;
  id: number;
  user: User;
  roleName: string;
  dateCreated: string;
  email: string;
}

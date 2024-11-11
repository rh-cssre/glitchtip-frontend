import { User } from "../user/user.interfaces";
import { Team } from "../teams/teams.interfaces";
import { OrganizationProject } from "../projects/projects-api.interfaces";

export interface OrganizationNew {
  name: string;
  slug?: string;
}

export interface Organization extends OrganizationNew {
  id: number;
  dateCreated: string;
  status: OrgStatus;
  avatar: Avatar;
  isEarlyAdopter: boolean;
  require2FA: boolean;
  isAcceptingEvents: boolean;
  slug: string;
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

export interface Member {
  role: MemberRole;
  id: number;
  user: User | null;
  roleName: string;
  dateCreated: string;
  email: string;
  pending: boolean;
  isOwner: boolean;
}

export interface MemberDetail extends Member {
  teams: string[];
  roles: MemberRoleDetail[];
}

export interface MemberSelector extends Member {
  loadingResendInvite: boolean;
  sentResendInvite: boolean;
  isMe: boolean;
}

export interface OrganizationUser extends Member {
  organization: Organization;
}

export type MemberRole = "member" | "admin" | "manager" | "owner";

export interface MemberRoleDetail {
  id: MemberRole;
  name: string;
  desc: string;
  scopes: string[];
}

export interface TeamRole {
  teamSlug: string;
  role: string;
}

export interface OrgMemberUpdate {
  orgRole: MemberRole;
  teamRoles: TeamRole[];
}

export interface OrgMemberIn extends OrgMemberUpdate {
  email: string;
  sendInvite?: boolean;
  reinvite?: boolean;
}

export interface OrganizationLoading {
  addTeamMember: string;
  removeTeamMember: string;
  addOrganizationMember: boolean;
}

export interface OrganizationErrors {
  createOrganization: string;
  addTeamMember: string;
  removeTeamMember: string;
  addOrganizationMember: string;
}

export interface Environment {
  id: number;
  name: string;
}

export interface ProjectEnvironment extends Environment {
  isHidden: boolean;
}

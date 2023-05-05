import { Organization } from "../organizations/organizations.interface";
import { RelatedTeam } from "../teams/teams.interfaces";

export interface ProjectNew {
  name: string;
  platform: string;
}

export interface ProjectReference extends ProjectNew {
  id: number;
  slug: string;
}

export interface APIProjectReference extends Omit<ProjectReference, "id"> {
  id: string;
}

export interface BaseProject extends ProjectReference {
  avatar: Avatar;
  color: string;
  features: [];
  firstEvent: string | null;
  hasAccess: boolean;
  isBookmarked: boolean;
  isInternal: boolean;
  isMember: boolean;
  isPublic: boolean;
  scrubIPAddresses: boolean;
  dateCreated: string;
}

export interface Project extends BaseProject {
  organization: Organization;
}

export interface APIProject extends Omit<Project, "id"> {
  id: string;
}

export interface ProjectDetail extends Project {
  teams: RelatedTeam[];
}

export interface APIProjectDetail extends Omit<ProjectDetail, "id"> {
  id: string;
}

export interface OrganizationProject extends BaseProject {
  teams: RelatedTeam[];
}

export interface APIOrganizationProject extends Omit<OrganizationProject, "id"> {
  id: string;
}

export interface DSN {
  public: string;
  security: string;
}

export interface ProjectKey {
  dateCreated: Date;
  dsn: DSN;
  id: string;
  label: string;
  public: string;
  projectId: string;
}

interface Avatar {
  avatarType: string;
  avatarUuid: string | null;
}

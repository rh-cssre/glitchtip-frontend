import { Organization } from "../organizations/organizations.interface";

export interface DSN {
  public: string;
}

export interface ProjectKeys {
  dateCreated: Date;
  dsn: DSN;
  id: string;
  label: string;
  public: string;
  projectId: string;
}

export interface ProjectNew {
  name: string;
  platform: string;
}

export interface ProjectIssueView extends ProjectNew {
  id: number;
  slug: string;
}

export interface Project extends ProjectIssueView {
  firstEvent: string;
  dateCreated: string;
  organization: Organization;
}

export interface ProjectDetail extends Project {
  avatar: Avatar;
  color: string;
  features: [];
  hasAccess: boolean;
  isBookmarked: boolean;
  isInternal: boolean;
  isMember: boolean;
  isPublic: boolean;
}

interface Avatar {
  avatarType: string;
  avatarUuid: string | null;
}

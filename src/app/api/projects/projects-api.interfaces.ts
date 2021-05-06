import { Organization } from "../organizations/organizations.interface";

export interface ProjectNew {
  name: string;
  platform: string;
}

export interface ProjectIssueView extends ProjectNew {
  id: string;
  slug: string;
  isMember?: boolean;
}

export interface Project extends ProjectIssueView {
  firstEvent: string | null;
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

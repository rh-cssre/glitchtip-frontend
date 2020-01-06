import { Organization } from "../organizations/organizations.interface";

export interface ProjectKey {
  label: string;
  public_key: string;
  date_added: string;
  dsn: string;
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

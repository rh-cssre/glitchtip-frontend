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
}

// tslint:disable-next-line:no-empty-interface
export interface OrganizationDetail extends Organization {
  projects: OrganizationProduct[];
}

interface OrgStatus {
  id: string;
  name: string;
}

export interface Avatar {
  avatarType: string;
  avatarUuid: string | null;
}

export interface OrganizationProduct {
  name: string;
  slug: string;
  platform: string | null;
  id: number;
}

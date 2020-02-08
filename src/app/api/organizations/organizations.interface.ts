export interface OrganizationNew {
  name: string;
  slug: string;
}

export interface Organization extends OrganizationNew {
  id: number;
  dateCreated: string;
  status: IStatus;
  avatar: IAvatar;
  isEarlyAdopter: boolean;
  require2FA: boolean;
}

// tslint:disable-next-line:no-empty-interface
export interface OrganizationDetail extends Organization {
  projects: OrganizationProduct[];
}

interface IStatus {
  id: string;
  name: string;
}

interface IAvatar {
  avatarType: string;
  avatarUuid: string | null;
}

export interface OrganizationProduct {
  name: string;
  slug: string;
  platform: string | null;
  id: number;
}

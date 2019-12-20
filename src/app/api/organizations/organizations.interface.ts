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

interface IStatus {
  id: string;
  name: string;
}

interface IAvatar {
  avatarType: string;
  avatarUuid: string | null;
}

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
  access: string[];
  allowSharedIssues: boolean;
  availableRoles: IAvailableRoles[];
  dataScrubber: boolean;
  dataScrubberDefaults: boolean;
  defaultRole: string;
  enhancedPrivacy: boolean;
  experiments: object;
  features: IFeatures[];
}

interface IStatus {
  id: string;
  name: string;
}

interface IAvatar {
  avatarType: string;
  avatarUuid: string | null;
}

interface IAvailableRoles {
  id: AvailableRolesId;
  name: AvailableRolesName;
}

type AvailableRolesId = "member" | "admin" | "manager" | "owner";

type AvailableRolesName = "Member" | "Admin" | "Manager" | "Owner";

type IFeatures = "new-teams" &
  "shared-issues" &
  "new-issues-ui" &
  "repos" &
  "open-membership" &
  "invite-members" &
  "sso-saml2" &
  "sso-basic" &
  "suggested-commits";

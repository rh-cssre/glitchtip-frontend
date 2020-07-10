import { OrganizationUser } from "../organizations/organizations.interface";

export interface AcceptAPIResponse {
  accept_invite: boolean;
  org_user: OrganizationUser;
}

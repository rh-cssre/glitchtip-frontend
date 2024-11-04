import { OrganizationUser } from "../organizations/organizations.interface";

export interface AcceptAPIResponse {
  acceptInvite: boolean;
  orgUser: OrganizationUser;
}

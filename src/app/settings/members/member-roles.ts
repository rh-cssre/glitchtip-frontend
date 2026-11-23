import { MemberRole } from "src/app/api/organizations/organizations.interface";

/** Same values a role is saved as, lowest access first. */
export const MEMBER_ROLES: MemberRole[] = [
  "member",
  "admin",
  "manager",
  "owner",
];

export function roleName(role: MemberRole | null | undefined) {
  switch (role) {
    case "owner":
      return $localize`Owner`;
    case "manager":
      return $localize`Manager`;
    case "admin":
      return $localize`Admin`;
    case "member":
      return $localize`Member`;
    default:
      return null;
  }
}

export function roleDescription(role: MemberRole | null | undefined) {
  switch (role) {
    case "owner":
      return $localize`Owners have full access to the organization, its data and its settings.`;
    case "manager":
      return $localize`Managers can also add and remove members, and manage every team.`;
    case "admin":
      return $localize`Admins can also create teams and projects, and manage the teams they are on.`;
    case "member":
      return $localize`Members can see and act on issues and events, and see most other data in the organization.`;
    default:
      return "";
  }
}

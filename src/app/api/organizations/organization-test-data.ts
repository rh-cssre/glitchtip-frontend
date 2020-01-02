import { Organization } from "./organizations.interface";

export const organizationList: Organization[] = [
  {
    id: 2,
    name: "test org",
    slug: "test-org",
    dateCreated: "2019-12-20T14:50:31.641549Z",
    status: {
      id: "active",
      name: "active"
    },
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    isEarlyAdopter: false,
    require2FA: false
  },
  {
    id: 1,
    name: "prince ali",
    slug: "prince-ali",
    dateCreated: "2019-12-20T14:49:28.631459Z",
    status: {
      id: "active",
      name: "active"
    },
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    isEarlyAdopter: false,
    require2FA: false
  }
];

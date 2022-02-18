import {
  Organization,
  OrganizationProject,
  OrganizationDetail,
} from "./organizations.interface";

interface APIOrganizationProject extends Omit<OrganizationProject, "id"> {
  id: string;
}

interface APIOrganizationDetail extends Omit<OrganizationDetail, "projects"> {
  projects: APIOrganizationProject[];
}

export const organizationList: Organization[] = [
  {
    id: 2,
    name: "test org",
    slug: "test-org",
    dateCreated: "2019-12-20T14:50:31.641549Z",
    status: {
      id: "active",
      name: "active",
    },
    avatar: {
      avatarType: "",
      avatarUuid: null,
    },
    isEarlyAdopter: false,
    require2FA: false,
    isAcceptingEvents: true,
  },
  {
    id: 1,
    name: "prince ali",
    slug: "prince-ali",
    dateCreated: "2019-12-20T14:49:28.631459Z",
    status: {
      id: "active",
      name: "active",
    },
    avatar: {
      avatarType: "",
      avatarUuid: null,
    },
    isEarlyAdopter: false,
    require2FA: false,
    isAcceptingEvents: true,
  },
];

export const testOrgDetail: APIOrganizationDetail = {
  id: 1,
  name: "prince ali",
  slug: "prince-ali",
  dateCreated: "2019-12-20T14:49:28.631459Z",
  status: {
    id: "active",
    name: "active",
  },
  avatar: {
    avatarType: "",
    avatarUuid: null,
  },
  isEarlyAdopter: false,
  require2FA: false,
  isAcceptingEvents: true,
  projects: [
    {
      platform: "",
      slug: "uptime-test",
      id: "72",
      name: "Uptime Test",
      isMember: true,
    },
  ],
  teams: [
    {
      dateCreated: "2022-02-16T16:54:36.086069Z",
      id: 38,
      isMember: true,
      memberCount: 1,
      slug: "test2",
    },
    {
      dateCreated: "2022-02-07T16:54:57.158485Z",
      id: 37,
      isMember: true,
      memberCount: 1,
      slug: "test",
    },
  ],
};

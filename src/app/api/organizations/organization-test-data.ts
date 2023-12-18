import { Organization, OrganizationDetail } from "./organizations.interface";
import { OrganizationProject } from "../projects/projects-api.interfaces";

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
      avatar: {
        avatarType: "",
        avatarUuid: null,
      },
      color: "",
      features: [],
      firstEvent: null,
      hasAccess: true,
      id: "72",
      isBookmarked: false,
      isInternal: false,
      isMember: true,
      isPublic: false,
      name: "uptime-test",
      scrubIPAddresses: true,
      slug: "Uptime Test",
      dateCreated: "2023-05-03T15:21:15.811252Z",
      platform: "",
      teams: [
        {
          id: 1,
          slug: "team",
        },
      ],
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

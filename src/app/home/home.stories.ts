import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, select } from "@storybook/addon-knobs";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/app/shared/shared.module";
import { HomeComponent } from "./home.component";

export default {
  title: "Welcome Screen",
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule
      ]
    }),
    withKnobs
  ]
};

const projects = [
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 13,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "shepherds-pie",
    organization: {
      id: 2,
      name: "potato",
      slug: "potato",
      dateCreated: "2020-03-23T15:39:28.494314Z",
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
    slug: "shepherds-pie",
    dateCreated: "2020-03-25T17:10:24.261648Z",
    platform: "pan"
  },
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 12,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "baked",
    organization: {
      id: 2,
      name: "potato",
      slug: "potato",
      dateCreated: "2020-03-23T15:39:28.494314Z",
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
    slug: "baked",
    dateCreated: "2020-03-25T17:10:00.331156Z",
    platform: "oven"
  },
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 11,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "mashed",
    organization: {
      id: 2,
      name: "potato",
      slug: "potato",
      dateCreated: "2020-03-23T15:39:28.494314Z",
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
    slug: "mashed",
    dateCreated: "2020-03-25T17:09:45.564927Z",
    platform: "midwest"
  },
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 10,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "bamboo",
    organization: {
      id: 1,
      name: "knit",
      slug: "knit",
      dateCreated: "2020-03-23T15:39:09.662650Z",
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
    slug: "bamboo",
    dateCreated: "2020-03-25T17:03:40.527400Z",
    platform: "tree"
  },
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 9,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "cotton",
    organization: {
      id: 1,
      name: "knit",
      slug: "knit",
      dateCreated: "2020-03-23T15:39:09.662650Z",
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
    slug: "cotton",
    dateCreated: "2020-03-25T17:03:31.211712Z",
    platform: "plant"
  },
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 8,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "acrylic",
    organization: {
      id: 1,
      name: "knit",
      slug: "knit",
      dateCreated: "2020-03-23T15:39:09.662650Z",
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
    slug: "acrylic",
    dateCreated: "2020-03-25T17:03:15.544121Z",
    platform: "machine"
  },
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 7,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "alpaca",
    organization: {
      id: 1,
      name: "knit",
      slug: "knit",
      dateCreated: "2020-03-23T15:39:09.662650Z",
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
    slug: "alpaca",
    dateCreated: "2020-03-25T17:02:53.430051Z",
    platform: "alpaca"
  },
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 6,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "wool",
    organization: {
      id: 1,
      name: "knit",
      slug: "knit",
      dateCreated: "2020-03-23T15:39:09.662650Z",
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
    slug: "wool",
    dateCreated: "2020-03-25T17:02:36.548654Z",
    platform: "sheep"
  },
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 5,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "silk",
    organization: {
      id: 1,
      name: "knit",
      slug: "knit",
      dateCreated: "2020-03-23T15:39:09.662650Z",
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
    slug: "silk",
    dateCreated: "2020-03-25T17:02:27.447889Z",
    platform: "worms"
  },
  {
    avatar: {
      avatarType: "",
      avatarUuid: null
    },
    color: "",
    features: [],
    firstEvent: null,
    hasAccess: true,
    id: 2,
    isBookmarked: false,
    isInternal: false,
    isMember: true,
    isPublic: false,
    name: "fries",
    organization: {
      id: 2,
      name: "potato",
      slug: "potato",
      dateCreated: "2020-03-23T15:39:28.494314Z",
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
    slug: "fry",
    dateCreated: "2020-03-23T15:40:47.029176Z",
    platform: "french"
  }
];

const organizations = [
  {
    id: 3,
    name: "quilt",
    slug: "quilt",
    dateCreated: "2020-03-25T14:45:56.622406Z",
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
    id: 2,
    name: "potato",
    slug: "potato",
    dateCreated: "2020-03-23T15:39:28.494314Z",
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
    name: "knit",
    slug: "knit",
    dateCreated: "2020-03-23T15:39:09.662650Z",
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

export const home = () => {
  const optionList = [
    "No Organizations",
    "No Projects",
    "Organization and Projects"
  ];
  const selectedOption = select("Option Type", optionList, optionList[0]);
  let project: any = !of(projects);
  let organization: any = !of(organizations);

  switch (selectedOption) {
    case "No Organizations":
      project = !of(projects);
      organization = !of(organizations);
      break;
    case "No Projects":
      project = !of(projects);
      organization = of(organizations);
      break;
    case "Organization and Projects":
      project = of(projects);
      organization = of(organizations);
      break;
  }

  return {
    component: HomeComponent,
    props: {
      projects$: project,
      activeOrganizationDetail$: organization
    }
  };
};

home.story = {
  parameters: {
    notes:
      "Oh hey you can leave notes. Why is the alignment so weird though? Not sure if this is a great place to take notes."
  }
};

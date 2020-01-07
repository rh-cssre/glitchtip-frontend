import { IssueDetail } from "../interfaces";

// data from api/0/issues/{{ issue number }}
export const sampleIssueDetail: IssueDetail = {
  seenBy: [
    {
      username: "emily@burkesoftware.com",
      lastLogin: "2020-01-06T16:45:45.663255Z",
      isSuperuser: false,
      emails: [
        { is_verified: true, id: "607715", email: "emily@burkesoftware.com" }
      ],
      isManaged: false,
      lastActive: "2020-01-07T19:03:32.475726Z",
      isStaff: false,
      identities: [],
      id: "559298",
      isActive: true,
      has2fa: false,
      name: "Emily Jensen",
      avatarUrl:
        "https://secure.gravatar.com/avatar/e3ab61b5794bcde2bc68ccfa1b860bf8?s=32&d=mm",
      dateJoined: "2019-12-02T18:32:40.995712Z",
      options: {
        timezone: "UTC",
        stacktraceOrder: -1,
        language: "en",
        clock24Hours: false
      },
      flags: { newsletter_consent_prompt: false },
      avatar: { avatarUuid: null, avatarType: "letter_avatar" },
      hasPasswordAuth: true,
      email: "emily@burkesoftware.com",
      lastSeen: "2020-01-07T19:03:50.656812Z"
    }
  ],
  platform: "python",
  pluginIssues: [],
  lastSeen: "2019-12-31T19:34:22.397462Z",
  userReportCount: 0,
  numComments: 0,
  userCount: 0,
  stats: {
    "30d": [
      [1575763200, 0],
      [1575849600, 0],
      [1575936000, 0],
      [1576022400, 0],
      [1576108800, 0],
      [1576195200, 0],
      [1576281600, 0],
      [1576368000, 0],
      [1576454400, 0],
      [1576540800, 0],
      [1576627200, 0],
      [1576713600, 0],
      [1576800000, 0],
      [1576886400, 0],
      [1576972800, 0],
      [1577059200, 0],
      [1577145600, 0],
      [1577232000, 0],
      [1577318400, 0],
      [1577404800, 0],
      [1577491200, 0],
      [1577577600, 0],
      [1577664000, 0],
      [1577750400, 1],
      [1577836800, 0],
      [1577923200, 0],
      [1578009600, 0],
      [1578096000, 0],
      [1578182400, 0],
      [1578268800, 0],
      [1578355200, 0]
    ],
    "24h": [
      [1578337200, 0],
      [1578340800, 0],
      [1578344400, 0],
      [1578348000, 0],
      [1578351600, 0],
      [1578355200, 0],
      [1578358800, 0],
      [1578362400, 0],
      [1578366000, 0],
      [1578369600, 0],
      [1578373200, 0],
      [1578376800, 0],
      [1578380400, 0],
      [1578384000, 0],
      [1578387600, 0],
      [1578391200, 0],
      [1578394800, 0],
      [1578398400, 0],
      [1578402000, 0],
      [1578405600, 0],
      [1578409200, 0],
      [1578412800, 0],
      [1578416400, 0],
      [1578420000, 0],
      [1578423600, 0]
    ]
  },
  culprit: "composeexample.wsgi in <module>",
  title: "NameError: name 'get_wsgi_application' is not defined",
  id: 1412895512,
  assignedTo: null,
  participants: [],
  logger: null,
  type: "error",
  annotations: [],
  metadata: {
    function: "<module>",
    type: "NameError",
    value: "name 'get_wsgi_application' is not defined",
    filename: "composeexample/wsgi.py"
  },
  status: "unresolved",
  pluginActions: [],
  tags: [
    { totalValues: 1, name: "Handled", key: "handled" },
    { totalValues: 1, name: "Level", key: "level" },
    { totalValues: 1, name: "Mechanism", key: "mechanism" },
    { totalValues: 1, name: "Runtime", key: "runtime" },
    { totalValues: 1, name: "Runtime.Name", key: "runtime.name" },
    { totalValues: 1, name: "Server", key: "server_name" }
  ],
  subscriptionDetails: null,
  isPublic: false,
  hasSeen: true,
  firstRelease: null,
  shortId: "DJANGO-APP-8",
  shareId: null,
  firstSeen: "2019-12-31T19:34:22.397462Z",
  count: "1",
  permalink:
    "https://sentry.io/organizations/burke-software-consulting/issues/1412895512/",
  level: "error",
  isSubscribed: false,
  pluginContexts: [],
  isBookmarked: false,
  project: {
    platform: "python",
    slug: "django-app",
    id: 1851390,
    name: "django-app"
  },
  lastRelease: null,
  activity: [
    {
      data: {},
      dateCreated: "2019-12-31T19:34:22.397462Z",
      type: "first_seen",
      id: "0",
      user: null
    }
  ],
  statusDetails: {}
};

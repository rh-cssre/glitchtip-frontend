export const monitorDetail = {
  id: 1,
  monitorType: "Ping",
  endpoint_id: null,
  created: "2022-03-17T13:37:37.853306Z",
  checks: [
    {
      isUp: true,
      startCheck: "2022-03-18T16:06:56.469565Z",
      reason: null,
      responseTime: 62,
    },
    {
      isUp: true,
      startCheck: "2022-03-18T16:05:56.449955Z",
      reason: null,
      responseTime: 60,
    },
    {
      isUp: false,
      startCheck: "2022-03-18T15:46:26.070202Z",
      reason: 5,
      responseTime: null,
    },
    {
      isUp: false,
      startCheck: "2022-03-18T15:45:21.909421Z",
      reason: 5,
      responseTime: null,
    },
    {
      isUp: false,
      startCheck: "2022-03-18T15:45:18.398777Z",
      reason: 5,
      responseTime: null,
    },
    {
      isUp: true,
      startCheck: "2022-03-18T15:44:56.030593Z",
      reason: null,
      responseTime: 62,
    },
    {
      isUp: true,
      startCheck: "2022-03-18T15:43:56.006602Z",
      reason: null,
      responseTime: 60,
    },
    {
      isUp: true,
      startCheck: "2022-03-18T15:42:55.986586Z",
      reason: null,
      responseTime: 1636,
    },
  ],
  name: "Example monitor",
  url: "https://example.com",
  expectedStatus: 200,
  expected_body: "",
  environment: null,
  project: null,
  organization: 1,
  interval: "00:01:00",
  isUp: true,
  lastChange: "2022-03-18T15:46:26.070202Z",
  heartbeatEndpoint: null,
  projectName: null,
  envName: null,
};

export const convertedSeries = [
  {
    name: "Up",
    series: [
      {
        name: new Date(Date.parse("2022-03-18T16:06:56.469Z")),
        value: 62,
      },
      {
        name: new Date(Date.parse("2022-03-18T16:05:56.449Z")),
        value: 61,
      },
    ],
  },
  {
    name: "Down",
    series: [
      {
        name: new Date(Date.parse("2022-03-18T15:46:26.070Z")),
        value: 0,
      },
      {
        name: new Date(Date.parse("2022-03-18T15:45:21.909Z")),
        value: 0,
      },
      {
        name: new Date(Date.parse("2022-03-18T15:45:18.398Z")),
        value: 0,
      },
    ],
  },
  {
    name: "Up",
    series: [
      {
        name: new Date(Date.parse("2022-03-18T15:44:56.030Z")),
        value: 62,
      },
      {
        name: new Date(Date.parse("2022-03-18T15:43:56.006Z")),
        value: 60,
      },
      {
        name: new Date(Date.parse("2022-03-18T15:42:55.986Z")),
        value: 1636,
      },
    ],
  },
];

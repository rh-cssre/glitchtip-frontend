import { EventDetail } from "src/app/issues/interfaces";

export const stacktraceUndefined: EventDetail = {
  eventID: "c5974fd9b97d4fcbb9ecc011f9a18144",
  id: "c5974fd9b97d4fcbb9ecc011f9a18144",
  groupID: "111",
  context: {
    error: {
      Op: "Post",
      Err: {
        Op: "read",
        Err: { Err: 104, Syscall: "read" },
        Net: "tcp",
        Addr: { IP: "redacted", Port: 123, Zone: "" },
        Source: { IP: "redacted", Port: 456, Zone: "" },
      },
      URL: "https://redacted",
    },
  },
  contexts: {
    os: { name: "linux" },
    device: { arch: "amd64", num_cpu: 2 },
    runtime: {
      name: "go",
      version: "go1.13.12",
      go_maxprocs: 2,
      go_numcgocalls: 5,
      go_numroutines: 8,
    },
  },
  culprit: "",
  dateCreated: "2020-12-14T14:35:46Z",
  dateReceived: "2020-12-14T14:36:03.617166Z",
  entries: [
    {
      type: "exception",
      data: {
        values: [
          {
            type: "*url.Error",
            value: "Post redacted: read: connection reset by peer",
          },
        ],
        hasSystemFrames: false,
      },
    },
  ],
  message: "",
  metadata: {
    type: "*url.Error",
    value: "Post https://redacted: read: connection reset by peer",
  },
  packages: { redacted: "redacted" },
  platform: "go",
  sdk: {
    name: "sentry.go",
    version: "0.9.0",
    packages: [{ name: "sentry-go", version: "0.9.0" }],
    integrations: [
      "ContextifyFrames",
      "Environment",
      "IgnoreErrors",
      "Modules",
    ],
  },
  tags: [],
  title: "*url.Error: Post https://redacted",
  type: "error",
  user: {
    username: null,
    name: null,
    ip_address: "redacted",
    email: null,
    data: {},
    id: null,
  },
  projectID: 149,
  userReport: null,
  nextEventID: null,
  previousEventID: null,
};

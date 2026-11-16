import { EventDetail } from "src/app/issues/interfaces";

export const emptyStacktrace: EventDetail = {
  eventID: "64b48dd6880446b882cb0da3949d6563",
  id: "64b48dd6880446b882cb0da3949d6563",
  groupID: "106",
  context: null,
  contexts: {
    os: { name: "Ubuntu" },
    device: { family: "Other" },
    browser: { name: "Firefox", version: "82.0" },
  },
  culprit: "redacted",
  dateCreated: "2020-11-01T00:00:00Z",
  dateReceived: "2020-11-20T19:04:10.554312Z",
  entries: [
    {
      type: "exception",
      data: {
        values: [
          {
            type: "Error",
            value:
              "NotAllowedError: The play method is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.",
            mechanism: { type: "onunhandledrejection", handled: false },
            stacktrace: {},
          },
        ],
        hasSystemFrames: false,
      },
    },
    {
      type: "request",
      data: {
        url: "redacted",
        headers: [
          [
            "User-Agent",
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0",
          ],
        ],
        inferredContentType: null,
      },
    },
  ],
  message: "",
  metadata: {
    type: "Error",
    value:
      "NotAllowedError: The play method is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.",
  },
  packages: null,
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    version: "5.26.0",
    packages: [{ name: "npm:@sentry/browser", version: "5.26.0" }],
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "RewriteFrames",
    ],
  },
  tags: [
    { key: "browser.name", value: "Firefox" },
    { key: "os.name", value: "Ubuntu" },
  ],
  title:
    "Error: NotAllowedError: The play method is not allowed by the user agent or the platform in the current con…",
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

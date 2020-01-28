import { EventDetail } from "../../../interfaces";

/*tslint:disable */
export const stringError: EventDetail = {
  eventID: "2ba0cf8565f248dc9501616cb4e0017b",
  dist: null,
  userReport: null,
  projectID: "2",
  previousEventID: "478ffecb97314a9193af6fc7f6f08d05",
  message:
    "viewWrappedDebugError an error string /vendor.js viewWrappedDebugError(/vendor.js)",
  id: "26",
  size: 4854,
  errors: [
    {
      data: {
        url: "http://localhost:4200/polyfills.js",
        value: "<class 'requests.exceptions.ConnectionError'>"
      },
      message: "Unable to fetch HTTP resource",
      type: "fetch_generic_error"
    },
    {
      data: {
        url: "http://localhost:4200/vendor.js",
        value: "<class 'requests.exceptions.ConnectionError'>"
      },
      message: "Unable to fetch HTTP resource",
      type: "fetch_generic_error"
    }
  ],
  culprit: "viewWrappedDebugError(/vendor.js)",
  title: "Error: an error string",
  platform: "javascript",
  location: "/vendor.js",
  nextEventID: null,
  type: "error",
  metadata: {
    function: "viewWrappedDebugError",
    type: "Error",
    value: "an error string",
    filename: "/vendor.js"
  },
  groupingConfig: { id: "legacy:2019-03-12" },
  crashFile: null,
  tags: [
    { value: "Firefox 72.0", key: "browser", _meta: null },
    { value: "Firefox", key: "browser.name", _meta: null },
    { value: "yes", key: "handled", _meta: null },
    { value: "error", key: "level", _meta: null },
    { value: "instrument", key: "mechanism", _meta: null },
    { value: "Linux", key: "os.name", _meta: null },
    { value: "http://localhost:4200/", key: "url", _meta: null },
    {
      query: "user.ip:208.53.32.36",
      value: "ip:208.53.32.36",
      key: "user",
      _meta: null
    }
  ],
  dateCreated: "2020-01-28T20:19:56.151Z",
  dateReceived: "2020-01-28T20:19:56.151Z",
  user: {
    username: null,
    name: null,
    ip_address: "208.53.32.36",
    email: null,
    data: {},
    id: null
  },
  entries: [
    {
      type: "exception",
      data: {
        values: [
          {
            stacktrace: {
              frames: [
                {
                  function: "globalZoneAwareCallback",
                  colNo: 27,
                  vars: null,
                  symbol: null,
                  module: "polyfills",
                  lineNo: 4864,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/polyfills.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/polyfills.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "invokeTask",
                  colNo: 14,
                  vars: null,
                  symbol: null,
                  module: "polyfills",
                  lineNo: 4838,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/polyfills.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/polyfills.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "invokeTask",
                  colNo: 34,
                  vars: null,
                  symbol: null,
                  module: "polyfills",
                  lineNo: 3700,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/polyfills.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/polyfills.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "runTask",
                  colNo: 47,
                  vars: null,
                  symbol: null,
                  module: "polyfills",
                  lineNo: 3403,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/polyfills.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/polyfills.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "invokeTask",
                  colNo: 60,
                  vars: null,
                  symbol: null,
                  module: "polyfills",
                  lineNo: 3625,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/polyfills.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/polyfills.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "onInvokeTask",
                  colNo: 33,
                  vars: null,
                  symbol: null,
                  module: "vendor",
                  lineNo: 70625,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/vendor.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/vendor.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "invokeTask",
                  colNo: 31,
                  vars: null,
                  symbol: null,
                  module: "polyfills",
                  lineNo: 3626,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/polyfills.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/polyfills.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "sentryWrapped",
                  colNo: 23,
                  vars: null,
                  symbol: null,
                  module: "vendor",
                  lineNo: 81911,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/vendor.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/vendor.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "decoratePreventDefault/<",
                  colNo: 50,
                  vars: null,
                  symbol: null,
                  module: "vendor",
                  lineNo: 79300,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/vendor.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/vendor.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "renderEventHandlerClosure/<",
                  colNo: 29,
                  vars: null,
                  symbol: null,
                  module: "vendor",
                  lineNo: 73554,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/vendor.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/vendor.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "dispatchEvent",
                  colNo: 25,
                  vars: null,
                  symbol: null,
                  module: "vendor",
                  lineNo: 61709,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/vendor.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/vendor.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "debugHandleEvent",
                  colNo: 12,
                  vars: null,
                  symbol: null,
                  module: "vendor",
                  lineNo: 75876,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/vendor.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/vendor.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "callWithDebugContext",
                  colNo: 15,
                  vars: null,
                  symbol: null,
                  module: "vendor",
                  lineNo: 76251,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/vendor.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/vendor.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                },
                {
                  function: "viewWrappedDebugError",
                  colNo: 15,
                  vars: null,
                  symbol: null,
                  module: "vendor",
                  lineNo: 61054,
                  trust: null,
                  errors: null,
                  package: null,
                  absPath: "http://localhost:4200/vendor.js",
                  inApp: false,
                  instructionAddr: null,
                  filename: "/vendor.js",
                  platform: null,
                  context: [],
                  symbolAddr: null
                }
              ],
              framesOmitted: null,
              registers: null,
              hasSystemFrames: false
            },
            module: null,
            rawStacktrace: null,
            mechanism: {
              data: { function: "<anonymous>" },
              type: "instrument",
              handled: true
            },
            threadId: null,
            value: "an error string",
            type: "Error"
          }
        ],
        excOmitted: null,
        hasSystemFrames: false
      }
    },
    {
      type: "breadcrumbs",
      data: {
        values: [
          {
            category: "console",
            level: "info",
            event_id: null,
            timestamp: "2020-01-28T20:19:53.476Z",
            data: {
              logger: "console",
              extra: {
                arguments: [
                  "Angular is running in the development mode. Call enableProdMode() to enable the production mode."
                ]
              }
            },
            message:
              "Angular is running in the development mode. Call enableProdMode() to enable the production mode.",
            type: "default"
          },
          {
            category: "ui.click",
            level: "info",
            event_id: null,
            timestamp: "2020-01-28T20:19:53.548Z",
            data: null,
            message: "body > app-root > ol > li > a",
            type: "default"
          },
          {
            category: "xhr",
            level: "info",
            event_id: null,
            timestamp: "2020-01-28T20:19:53.569Z",
            data: {
              url: "http://localhost:4200/sockjs-node/info?t=1580242793552",
              status_code: 200,
              method: "GET"
            },
            message: null,
            type: "http"
          },
          {
            category: "ui.click",
            level: "info",
            event_id: null,
            timestamp: "2020-01-28T20:19:55.949Z",
            data: null,
            message: "body > app-root > ol > li > a",
            type: "default"
          }
        ]
      }
    },
    {
      type: "request",
      data: {
        fragment: "",
        cookies: [],
        inferredContentType: null,
        env: null,
        headers: [
          [
            "User-Agent",
            "Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0"
          ]
        ],
        url: "http://localhost:4200/",
        query: [],
        data: null,
        method: null
      }
    }
  ],
  packages: {},
  sdk: {
    version: "5.11.1",
    name: "sentry.javascript.browser",
    upstream: { url: null, isNewer: false, name: "sentry.javascript.browser" }
  },
  _meta: {
    user: null,
    context: null,
    entries: {},
    contexts: null,
    message: null,
    packages: null,
    tags: {},
    sdk: null
  },
  contexts: {
    os: { type: "os", name: "Linux" },
    browser: { version: "72.0", type: "browser", name: "Firefox" }
  },
  fingerprints: ["cd05695f108567c9cd4e56c8945ade8b"],
  context: { arguments: [] },
  release: null,
  groupID: "7"
};

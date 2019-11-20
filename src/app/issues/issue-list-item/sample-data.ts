import { IEvent } from "../interfaces";

export const sampleEvent: IEvent = {
  exception: {
    values: [
      {
        type: "Error",
        value: "blarg",
        stacktrace: {
          frames: [
            {
              colno: 29,
              filename: "http://localhost:4200/polyfills.js",
              function: "timer",
              in_app: true,
              lineno: 5656
            },
            {
              colno: 48,
              filename: "http://localhost:4200/polyfills.js",
              function: "ZoneTask.invoke",
              in_app: true,
              lineno: 3460
            },
            {
              colno: 34,
              filename: "http://localhost:4200/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 3471
            },
            {
              colno: 47,
              filename: "http://localhost:4200/polyfills.js",
              function: "Zone.runTask",
              in_app: true,
              lineno: 3174
            },
            {
              colno: 60,
              filename: "http://localhost:4200/polyfills.js",
              function: "ZoneDelegate.invokeTask",
              in_app: true,
              lineno: 3396
            },
            {
              colno: 33,
              filename: "http://localhost:4200/vendor.js",
              function: "Object.onInvokeTask",
              in_app: true,
              lineno: 85760
            },
            {
              colno: 31,
              filename: "http://localhost:4200/polyfills.js",
              function: "ZoneDelegate.invokeTask",
              in_app: true,
              lineno: 3397
            },
            {
              colno: 19,
              filename: "http://localhost:4200/main.js",
              function: "?",
              in_app: true,
              lineno: 1873
            }
          ]
        },
        mechanism: {
          handled: true,
          type: "generic"
        }
      }
    ]
  },
  level: "error",
  event_id: "1b80eac88dad40eeabe6356db6f9359d",
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [
      {
        name: "npm:@sentry/browser",
        version: "5.7.1"
      }
    ],
    version: "5.7.1",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent"
    ]
  },
  release: "1.13.3",
  breadcrumbs: [
    {
      timestamp: 1574283165.869,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4200/sockjs-node/info?t=1574283165820",
        status_code: 200
      },
      type: "http"
    },
    {
      timestamp: 1574283166.547,
      category: "console",
      data: {
        extra: {
          arguments: ["wut"]
        },
        logger: "console"
      },
      level: "log",
      message: "wut"
    }
  ],
  request: {
    url: "http://localhost:4200/account/login",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
    }
  }
};

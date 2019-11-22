import { IEvent } from "../interfaces";

export const sampleEvent: IEvent = {
  event_id: "1b80eac8-8dad-40ee-abe6-356db6f9359d",
  exception: {
    values: [
      {
        type: "Error",
        value: "blarg",
        mechanism: {
          type: "generic",
          handled: true
        },
        stacktrace: {
          frames: [
            {
              colno: 29,
              in_app: true,
              lineno: 5656,
              filename: "http://localhost:4200/polyfills.js",
              function: "timer"
            },
            {
              colno: 48,
              in_app: true,
              lineno: 3460,
              filename: "http://localhost:4200/polyfills.js",
              function: "ZoneTask.invoke"
            }
          ]
        }
      }
    ]
  },
  level: "error",
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    version: "5.7.1",
    packages: [
      {
        name: "npm:@sentry/browser",
        version: "5.7.1"
      }
    ],
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
      data: {
        url: "http://localhost:4200/sockjs-node/info?t=1574283165820",
        method: "GET",
        status_code: 200
      },
      type: "http",
      category: "xhr",
      timestamp: 1574283165.869
    },
    {
      data: {
        extra: {
          arguments: ["wut"]
        },
        logger: "console"
      },
      level: "log",
      message: "wut",
      category: "console",
      timestamp: 1574283166.547
    }
  ],
  request: {
    url: "http://localhost:4200/account/login",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
    }
  },
  received_at: "2019-11-20T23:25:16.300108Z"
};

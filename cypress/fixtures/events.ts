import { environments } from "./variables";
import { uniqueId } from "../integration/utils";

export const criticalMessage = {
  message: "Critical Error",
  level: "critical",
  event_id: "96de7b91117842b2b13d45bbed6924f2",
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: 1617248494.277,
  environment: "grrrr",
  contexts: {
    trace: {
      op: "pageload",
      span_id: "90e4a530f0e1c9d1",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
      },
      trace_id: "eb14ef60cb5649dca86ebd8ba968f330",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617248490.962,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617248490.966,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617248490.979,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617248490.994,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617248490979",
        status_code: 200,
      },
      type: "http",
    },
    {
      timestamp: 1617248492.899,
      category: "sentry.event",
      event_id: "e3acf095b9ac405f823b5eb633cdaacf",
      level: "info",
      message: "A user actually clicked this thing",
    },
    {
      timestamp: 1617248492.903,
      category: "ui.click",
      message: "body > app-root > ol > li > button",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
    },
  },
};

export const infoMessage = {
  message: "A user actually clicked this thing",
  level: "info",
  event_id: "e3acf095b9ac405f823b5eb633cdaacf",
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: 1617248492.895,
  environment: "grrrr",
  contexts: {
    trace: {
      op: "pageload",
      span_id: "90e4a530f0e1c9d1",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
      },
      trace_id: "eb14ef60cb5649dca86ebd8ba968f330",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617248490.962,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617248490.966,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617248490.979,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617248490.994,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617248490979",
        status_code: 200,
      },
      type: "http",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
    },
  },
};
export const warningMessage = {
  message: "Warning: something is a little bit bad",
  level: "warning",
  event_id: "4a36bb8becc44e3088a359218faecb80",
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: 1617248240.919,
  environment: "grrrr",
  contexts: {
    trace: {
      op: "pageload",
      span_id: "9cb691e04712aa93",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
      },
      trace_id: "76f86569455d499b8da2bd2aeaa7f9e4",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617248238.536,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617248238.54,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617248238.552,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617248238.585,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617248238552",
        status_code: 200,
      },
      type: "http",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
    },
  },
};

export const debugMessage = {
  message: "Debug message",
  level: "debug",
  event_id: "dd08d8f04fe841d4b44f6fc294251979",
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: 1617247994.923,
  environment: "grrrr",
  contexts: {
    trace: {
      op: "pageload",
      span_id: "807000baccc94ed1",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
      },
      trace_id: "f7c369c07e014b05a5751aa06afd8ab9",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617247992.853,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617247992.857,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617247992.876,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617247992.913,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617247992878",
        status_code: 200,
      },
      type: "http",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
    },
  },
};

export const autoplayError = {
  exception: {
    values: [
      {
        type: "EvalError",
        value:
          'MDN says "EvalError is not used in the current ECMAScript specification and will thus not be thrown by the runtime. However, the object itself remains for backwards compatibility with earlier versions of the specification."',
        stacktrace: {
          frames: [
            {
              colno: 21,
              filename: "http://localhost:4201/polyfills.js",
              function: "HTMLButtonElement.globalZoneAwareCallback",
              in_app: true,
              lineno: 1743,
            },
            {
              colno: 18,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 1717,
            },
            {
              colno: 38,
              filename: "http://localhost:4201/polyfills.js",
              function: "ZoneTask.invokeTask [as invoke]",
              in_app: true,
              lineno: 576,
            },
            {
              colno: 51,
              filename: "http://localhost:4201/polyfills.js",
              function: "Zone.runTask",
              in_app: true,
              lineno: 263,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "ZoneDelegate.invokeTask",
              in_app: true,
              lineno: 494,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "Object.onInvokeTask",
              in_app: true,
              lineno: 47780,
            },
            {
              colno: 35,
              filename: "http://localhost:4201/polyfills.js",
              function: "ZoneDelegate.invokeTask",
              in_app: true,
              lineno: 495,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "HTMLButtonElement.sentryWrapped",
              in_app: true,
              lineno: 79817,
            },
            {
              colno: 38,
              filename: "http://localhost:4201/vendor.js",
              function: "HTMLButtonElement.<anonymous>",
              in_app: true,
              lineno: 53584,
            },
            {
              colno: 22,
              filename: "http://localhost:4201/vendor.js",
              function: "wrapListenerIn_markDirtyAndPreventDefault",
              in_app: true,
              lineno: 34527,
            },
            {
              colno: 16,
              filename: "http://localhost:4201/vendor.js",
              function: "executeListenerWithErrorHandling",
              in_app: true,
              lineno: 34492,
            },
            {
              colno: 146,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent_Template_button_click_14_listener",
              in_app: true,
              lineno: 203,
            },
            {
              colno: 15,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent.throwEvalError",
              in_app: true,
              lineno: 143,
            },
          ],
        },
        mechanism: { handled: true, type: "generic" },
      },
    ],
  },
  level: "error",
  event_id: "7a9d061a477b4f1f9363dc9eb078d5ab",
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: 1617247433.425,
  environment: "grrrr",
  contexts: {
    trace: {
      op: "pageload",
      span_id: "96824092a8c6f343",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
      },
      trace_id: "891daa720ccb4171b0fd1f41344ee961",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617247424.183,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617247424.186,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617247424.201,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617247424.208,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617247424202",
        status_code: 200,
      },
      type: "http",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
    },
  },
};

export const evalError = {
  message:
    "NotAllowedError: The play method is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.",
  exception: {
    values: [
      {
        value:
          "NotAllowedError: The play method is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.",
        type: "Error",
        mechanism: { handled: false, type: "onunhandledrejection" },
      },
    ],
  },
  tags: { transaction: "/autoplay", "DOMException.code": "0" },
  level: "error",
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  event_id: "c7b2b791d2f24512b20de453a0d28396",
  timestamp: 1617247530.337,
  environment: "grrrr",
  contexts: {
    trace: {
      op: "pageload",
      span_id: "a33222d43851a661",
      status: "internal_error",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
      },
      trace_id: "e20a6bf912744b368a21893469c42675",
    },
  },
  breadcrumbs: [
    {
      timestamp: 1617247530.309,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617247530.317,
      category: "navigation",
      data: { from: "/autoplay", to: "/autoplay" },
    },
  ],
  request: {
    url: "http://localhost:4201/autoplay",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
    },
  },
};

export const jsRangeError = {
  exception: {
    values: [
      {
        type: "RangeError",
        value: "The number must be between 0 and 10.",
        stacktrace: {
          frames: [
            {
              colno: 39,
              filename: "http://localhost:4201/polyfills.js",
              function: "drainMicroTaskQueue",
              in_app: true,
              lineno: 665,
            },
            {
              colno: 51,
              filename: "http://localhost:4201/polyfills.js",
              function: "runTask",
              in_app: true,
              lineno: 263,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 494,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvokeTask",
              in_app: true,
              lineno: 47741,
            },
            {
              colno: 35,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 495,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleResolveOrReject/<",
              in_app: true,
              lineno: 953,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "run",
              in_app: true,
              lineno: 219,
            },
            {
              colno: 36,
              filename: "http://localhost:4201/polyfills.js",
              function: "invoke",
              in_app: true,
              lineno: 459,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvoke",
              in_app: true,
              lineno: 47753,
            },
            {
              colno: 30,
              filename: "http://localhost:4201/polyfills.js",
              function: "invoke",
              in_app: true,
              lineno: 460,
            },
            {
              colno: 26,
              filename: "http://localhost:4201/vendor.js",
              function: "bootstrapModuleFactory/</</<",
              in_app: true,
              lineno: 48370,
            },
            {
              colno: 44,
              filename: "http://localhost:4201/vendor.js",
              function: "_moduleDoBootstrap",
              in_app: true,
              lineno: 48400,
            },
            {
              colno: 64,
              filename: "http://localhost:4201/vendor.js",
              function: "_moduleDoBootstrap/<",
              in_app: true,
              lineno: 48400,
            },
            {
              colno: 42,
              filename: "http://localhost:4201/vendor.js",
              function: "bootstrap",
              in_app: true,
              lineno: 48687,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "create",
              in_app: true,
              lineno: 44309,
            },
            {
              colno: 34,
              filename: "http://localhost:4201/vendor.js",
              function: "renderView",
              in_app: true,
              lineno: 28614,
            },
            {
              colno: 24,
              filename: "http://localhost:4201/vendor.js",
              function: "renderChildComponents",
              in_app: true,
              lineno: 28454,
            },
            {
              colno: 15,
              filename: "http://localhost:4201/vendor.js",
              function: "renderComponent",
              in_app: true,
              lineno: 29864,
            },
            {
              colno: 28,
              filename: "http://localhost:4201/vendor.js",
              function: "renderView",
              in_app: true,
              lineno: 28589,
            },
            {
              colno: 19,
              filename: "http://localhost:4201/vendor.js",
              function: "executeTemplate",
              in_app: true,
              lineno: 28782,
            },
            {
              colno: 52,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent_Template",
              in_app: true,
              lineno: 209,
            },
            {
              colno: 21,
              filename: "http://localhost:4201/vendor.js",
              function: "ɵɵlistener",
              in_app: true,
              lineno: 34288,
            },
            {
              colno: 44,
              filename: "http://localhost:4201/vendor.js",
              function: "listenerInternal",
              in_app: true,
              lineno: 34408,
            },
            {
              colno: 34,
              filename: "http://localhost:4201/vendor.js",
              function: "listen",
              in_app: true,
              lineno: 53734,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "addEventListener",
              in_app: true,
              lineno: 53358,
            },
            {
              colno: 17,
              filename: "http://localhost:4201/vendor.js",
              function: "addEventListener",
              in_app: true,
              lineno: 53813,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "instrumentDOM/</</<",
              in_app: true,
              lineno: 5038,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "wytX/TryCatch.prototype._wrapEventTarget/</<",
              in_app: true,
              lineno: 80294,
            },
            {
              colno: 39,
              filename: "http://localhost:4201/polyfills.js",
              function: "makeAddListener/<",
              in_app: true,
              lineno: 2024,
            },
            {
              colno: 29,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleEventTask",
              in_app: true,
              lineno: 332,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 306,
            },
            {
              colno: 55,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 474,
            },
            {
              colno: 69,
              filename: "http://localhost:4201/polyfills.js",
              function: "onScheduleTask",
              in_app: true,
              lineno: 368,
            },
            {
              colno: 30,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 481,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "EventListener.handleEvent*customScheduleGlobal",
              in_app: true,
              lineno: 1869,
            },
            {
              colno: 31,
              filename: "http://localhost:4201/polyfills.js",
              function: "globalZoneAwareCallback",
              in_app: true,
              lineno: 1743,
            },
            {
              colno: 18,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 1717,
            },
            {
              colno: 38,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 576,
            },
            {
              colno: 51,
              filename: "http://localhost:4201/polyfills.js",
              function: "runTask",
              in_app: true,
              lineno: 263,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 494,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvokeTask",
              in_app: true,
              lineno: 47741,
            },
            {
              colno: 35,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 495,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "sentryWrapped",
              in_app: true,
              lineno: 79817,
            },
            {
              colno: 50,
              filename: "http://localhost:4201/vendor.js",
              function: "decoratePreventDefault/<",
              in_app: true,
              lineno: 53545,
            },
            {
              colno: 54,
              filename: "http://localhost:4201/vendor.js",
              function: "wrapListenerIn_markDirtyAndPreventDefault",
              in_app: true,
              lineno: 34488,
            },
            {
              colno: 16,
              filename: "http://localhost:4201/vendor.js",
              function: "executeListenerWithErrorHandling",
              in_app: true,
              lineno: 34453,
            },
            {
              colno: 146,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent_Template_button_click_17_listener",
              in_app: true,
              lineno: 209,
            },
            {
              colno: 19,
              filename: "http://localhost:4201/main.js",
              function: "checkRange",
              in_app: true,
              lineno: 147,
            },
          ],
        },
        mechanism: { handled: true, type: "generic" },
      },
    ],
  },
  level: "error",
  event_id: uniqueId(),
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: 1617119801.843,
  environment: environments.production,
  contexts: {
    trace: {
      op: "pageload",
      span_id: "b1c91194f8aeb446",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
      },
      trace_id: "b441f1a2469e40f998a0a22a9c33a4da",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617119800.24,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617119800.245,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617119800.258,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617119800.339,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617119800259",
        status_code: 200,
      },
      type: "http",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
    },
  },
};

export const jsReferenceError = {
  exception: {
    values: [
      {
        type: "ReferenceError",
        value: "undefinedVariable is not defined",
        stacktrace: {
          frames: [
            {
              colno: 39,
              filename: "http://localhost:4201/polyfills.js",
              function: "drainMicroTaskQueue",
              in_app: true,
              lineno: 665,
            },
            {
              colno: 51,
              filename: "http://localhost:4201/polyfills.js",
              function: "runTask",
              in_app: true,
              lineno: 263,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 494,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvokeTask",
              in_app: true,
              lineno: 47741,
            },
            {
              colno: 35,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 495,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleResolveOrReject/<",
              in_app: true,
              lineno: 953,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "run",
              in_app: true,
              lineno: 219,
            },
            {
              colno: 36,
              filename: "http://localhost:4201/polyfills.js",
              function: "invoke",
              in_app: true,
              lineno: 459,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvoke",
              in_app: true,
              lineno: 47753,
            },
            {
              colno: 30,
              filename: "http://localhost:4201/polyfills.js",
              function: "invoke",
              in_app: true,
              lineno: 460,
            },
            {
              colno: 26,
              filename: "http://localhost:4201/vendor.js",
              function: "bootstrapModuleFactory/</</<",
              in_app: true,
              lineno: 48370,
            },
            {
              colno: 44,
              filename: "http://localhost:4201/vendor.js",
              function: "_moduleDoBootstrap",
              in_app: true,
              lineno: 48400,
            },
            {
              colno: 64,
              filename: "http://localhost:4201/vendor.js",
              function: "_moduleDoBootstrap/<",
              in_app: true,
              lineno: 48400,
            },
            {
              colno: 42,
              filename: "http://localhost:4201/vendor.js",
              function: "bootstrap",
              in_app: true,
              lineno: 48687,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "create",
              in_app: true,
              lineno: 44309,
            },
            {
              colno: 34,
              filename: "http://localhost:4201/vendor.js",
              function: "renderView",
              in_app: true,
              lineno: 28614,
            },
            {
              colno: 24,
              filename: "http://localhost:4201/vendor.js",
              function: "renderChildComponents",
              in_app: true,
              lineno: 28454,
            },
            {
              colno: 15,
              filename: "http://localhost:4201/vendor.js",
              function: "renderComponent",
              in_app: true,
              lineno: 29864,
            },
            {
              colno: 28,
              filename: "http://localhost:4201/vendor.js",
              function: "renderView",
              in_app: true,
              lineno: 28589,
            },
            {
              colno: 19,
              filename: "http://localhost:4201/vendor.js",
              function: "executeTemplate",
              in_app: true,
              lineno: 28782,
            },
            {
              colno: 52,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent_Template",
              in_app: true,
              lineno: 215,
            },
            {
              colno: 21,
              filename: "http://localhost:4201/vendor.js",
              function: "ɵɵlistener",
              in_app: true,
              lineno: 34288,
            },
            {
              colno: 44,
              filename: "http://localhost:4201/vendor.js",
              function: "listenerInternal",
              in_app: true,
              lineno: 34408,
            },
            {
              colno: 34,
              filename: "http://localhost:4201/vendor.js",
              function: "listen",
              in_app: true,
              lineno: 53734,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "addEventListener",
              in_app: true,
              lineno: 53358,
            },
            {
              colno: 17,
              filename: "http://localhost:4201/vendor.js",
              function: "addEventListener",
              in_app: true,
              lineno: 53813,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "instrumentDOM/</</<",
              in_app: true,
              lineno: 5038,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "wytX/TryCatch.prototype._wrapEventTarget/</<",
              in_app: true,
              lineno: 80294,
            },
            {
              colno: 39,
              filename: "http://localhost:4201/polyfills.js",
              function: "makeAddListener/<",
              in_app: true,
              lineno: 2024,
            },
            {
              colno: 29,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleEventTask",
              in_app: true,
              lineno: 332,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 306,
            },
            {
              colno: 55,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 474,
            },
            {
              colno: 69,
              filename: "http://localhost:4201/polyfills.js",
              function: "onScheduleTask",
              in_app: true,
              lineno: 368,
            },
            {
              colno: 30,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 481,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "EventListener.handleEvent*customScheduleGlobal",
              in_app: true,
              lineno: 1869,
            },
            {
              colno: 31,
              filename: "http://localhost:4201/polyfills.js",
              function: "globalZoneAwareCallback",
              in_app: true,
              lineno: 1743,
            },
            {
              colno: 18,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 1717,
            },
            {
              colno: 38,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 576,
            },
            {
              colno: 51,
              filename: "http://localhost:4201/polyfills.js",
              function: "runTask",
              in_app: true,
              lineno: 263,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 494,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvokeTask",
              in_app: true,
              lineno: 47741,
            },
            {
              colno: 35,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 495,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "sentryWrapped",
              in_app: true,
              lineno: 79817,
            },
            {
              colno: 50,
              filename: "http://localhost:4201/vendor.js",
              function: "decoratePreventDefault/<",
              in_app: true,
              lineno: 53545,
            },
            {
              colno: 54,
              filename: "http://localhost:4201/vendor.js",
              function: "wrapListenerIn_markDirtyAndPreventDefault",
              in_app: true,
              lineno: 34488,
            },
            {
              colno: 16,
              filename: "http://localhost:4201/vendor.js",
              function: "executeListenerWithErrorHandling",
              in_app: true,
              lineno: 34453,
            },
            {
              colno: 146,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent_Template_button_click_20_listener",
              in_app: true,
              lineno: 215,
            },
            {
              colno: 17,
              filename: "http://localhost:4201/main.js",
              function: "throwReferenceError",
              in_app: true,
              lineno: 152,
            },
          ],
        },
        mechanism: { handled: true, type: "generic" },
      },
    ],
  },
  level: "error",
  event_id: uniqueId(),
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: 1617119948.811,
  environment: environments.staging,
  contexts: {
    trace: {
      op: "pageload",
      span_id: "b1c91194f8aeb446",
      status: "cancelled",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
        visibilitychange: "document.hidden",
      },
      trace_id: "b441f1a2469e40f998a0a22a9c33a4da",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617119800.24,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617119800.245,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617119800.258,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617119800.339,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617119800259",
        status_code: 200,
      },
      type: "http",
    },
    {
      timestamp: 1617119801.846,
      category: "sentry.event",
      event_id: "2dd83f0e558c43be8f74b6ac310e3cd7",
      level: "error",
      message: "RangeError: The number must be between 0 and 10.",
    },
    {
      timestamp: 1617119801.849,
      category: "sentry.event",
      event_id: "984c336e2767438da5cd62f26ad88862",
      level: "error",
      message: "RangeError: The number must be between 0 and 10.",
    },
    {
      timestamp: 1617119801.851,
      category: "console",
      data: {
        arguments: [
          {
            message: "The number must be between 0 and 10.",
            name: "RangeError",
            stack:
              "checkRange@http://localhost:4201/main.js:147:19\nAppComponent_Template_button_click_17_listener@http://localhost:4201/main.js:209:146\nexecuteListenerWithErrorHandling@http://localhost:4201/vendor.js:34453:16\nwrapListenerIn_markDirtyAndPreventDefault@http://localhost:4201/vendor.js:34488:54\ndecoratePreventDefault/<@http://localhost:4201/vendor.js:53545:50\nsentryWrapped@http://localhost:4201/vendor.js:79817:23\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ninvokeTask@http://localhost:4201/polyfills.js:576:38\ninvokeTask@http://localhost:4201/polyfills.js:1717:18\nglobalZoneAwareCallback@http://localhost:4201/polyfills.js:1743:31\nEventListener.handleEvent*customScheduleGlobal@http://localhost:4201/polyfills.js:1869:47\nscheduleTask@http://localhost:4201/polyfills.js:481:30\nonScheduleTask@http://localhost:4201/polyfills.js:368:69\nscheduleTask@http://localhost:4201/polyfills.js:474:55\nscheduleTask@http://localhost:4201/polyfills.js:306:47\nscheduleEventTask@http://localhost:4201/polyfills.js:332:29\nmakeAddListener/<@http://localhost:4201/polyfills.js:2024:39\nwytX/TryCatch.prototype._wrapEventTarget/</<@http://localhost:4201/vendor.js:80294:33\ninstrumentDOM/</</<@http://localhost:4201/vendor.js:5038:33\naddEventListener@http://localhost:4201/vendor.js:53813:17\naddEventListener@http://localhost:4201/vendor.js:53358:23\nlisten@http://localhost:4201/vendor.js:53734:34\nlistenerInternal@http://localhost:4201/vendor.js:34408:44\nɵɵlistener@http://localhost:4201/vendor.js:34288:21\nAppComponent_Template@http://localhost:4201/main.js:209:52\nexecuteTemplate@http://localhost:4201/vendor.js:28782:19\nrenderView@http://localhost:4201/vendor.js:28589:28\nrenderComponent@http://localhost:4201/vendor.js:29864:15\nrenderChildComponents@http://localhost:4201/vendor.js:28454:24\nrenderView@http://localhost:4201/vendor.js:28614:34\ncreate@http://localhost:4201/vendor.js:44309:23\nbootstrap@http://localhost:4201/vendor.js:48687:42\n_moduleDoBootstrap/<@http://localhost:4201/vendor.js:48400:64\n_moduleDoBootstrap@http://localhost:4201/vendor.js:48400:44\nbootstrapModuleFactory/</</<@http://localhost:4201/vendor.js:48370:26\ninvoke@http://localhost:4201/polyfills.js:460:30\nonInvoke@http://localhost:4201/vendor.js:47753:33\ninvoke@http://localhost:4201/polyfills.js:459:36\nrun@http://localhost:4201/polyfills.js:219:47\nscheduleResolveOrReject/<@http://localhost:4201/polyfills.js:953:40\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ndrainMicroTaskQueue@http://localhost:4201/polyfills.js:665:39\n",
          },
        ],
        logger: "console",
      },
      level: "error",
      message: "RangeError: The number must be between 0 and 10.",
    },
    {
      timestamp: 1617119801.852,
      category: "ui.click",
      message: "body > app-root > ol > li > button",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
    },
  },
};

export const jsSyntaxError = {
  exception: {
    values: [
      {
        type: "ReferenceError",
        value: "nope is not defined",
        stacktrace: {
          frames: [
            {
              colno: 39,
              filename: "http://localhost:4201/polyfills.js",
              function: "drainMicroTaskQueue",
              in_app: true,
              lineno: 665,
            },
            {
              colno: 51,
              filename: "http://localhost:4201/polyfills.js",
              function: "runTask",
              in_app: true,
              lineno: 263,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 494,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvokeTask",
              in_app: true,
              lineno: 47741,
            },
            {
              colno: 35,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 495,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleResolveOrReject/<",
              in_app: true,
              lineno: 953,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "run",
              in_app: true,
              lineno: 219,
            },
            {
              colno: 36,
              filename: "http://localhost:4201/polyfills.js",
              function: "invoke",
              in_app: true,
              lineno: 459,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvoke",
              in_app: true,
              lineno: 47753,
            },
            {
              colno: 30,
              filename: "http://localhost:4201/polyfills.js",
              function: "invoke",
              in_app: true,
              lineno: 460,
            },
            {
              colno: 26,
              filename: "http://localhost:4201/vendor.js",
              function: "bootstrapModuleFactory/</</<",
              in_app: true,
              lineno: 48370,
            },
            {
              colno: 44,
              filename: "http://localhost:4201/vendor.js",
              function: "_moduleDoBootstrap",
              in_app: true,
              lineno: 48400,
            },
            {
              colno: 64,
              filename: "http://localhost:4201/vendor.js",
              function: "_moduleDoBootstrap/<",
              in_app: true,
              lineno: 48400,
            },
            {
              colno: 42,
              filename: "http://localhost:4201/vendor.js",
              function: "bootstrap",
              in_app: true,
              lineno: 48687,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "create",
              in_app: true,
              lineno: 44309,
            },
            {
              colno: 34,
              filename: "http://localhost:4201/vendor.js",
              function: "renderView",
              in_app: true,
              lineno: 28614,
            },
            {
              colno: 24,
              filename: "http://localhost:4201/vendor.js",
              function: "renderChildComponents",
              in_app: true,
              lineno: 28454,
            },
            {
              colno: 15,
              filename: "http://localhost:4201/vendor.js",
              function: "renderComponent",
              in_app: true,
              lineno: 29864,
            },
            {
              colno: 28,
              filename: "http://localhost:4201/vendor.js",
              function: "renderView",
              in_app: true,
              lineno: 28589,
            },
            {
              colno: 19,
              filename: "http://localhost:4201/vendor.js",
              function: "executeTemplate",
              in_app: true,
              lineno: 28782,
            },
            {
              colno: 52,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent_Template",
              in_app: true,
              lineno: 221,
            },
            {
              colno: 21,
              filename: "http://localhost:4201/vendor.js",
              function: "ɵɵlistener",
              in_app: true,
              lineno: 34288,
            },
            {
              colno: 44,
              filename: "http://localhost:4201/vendor.js",
              function: "listenerInternal",
              in_app: true,
              lineno: 34408,
            },
            {
              colno: 34,
              filename: "http://localhost:4201/vendor.js",
              function: "listen",
              in_app: true,
              lineno: 53734,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "addEventListener",
              in_app: true,
              lineno: 53358,
            },
            {
              colno: 17,
              filename: "http://localhost:4201/vendor.js",
              function: "addEventListener",
              in_app: true,
              lineno: 53813,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "instrumentDOM/</</<",
              in_app: true,
              lineno: 5038,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "wytX/TryCatch.prototype._wrapEventTarget/</<",
              in_app: true,
              lineno: 80294,
            },
            {
              colno: 39,
              filename: "http://localhost:4201/polyfills.js",
              function: "makeAddListener/<",
              in_app: true,
              lineno: 2024,
            },
            {
              colno: 29,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleEventTask",
              in_app: true,
              lineno: 332,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 306,
            },
            {
              colno: 55,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 474,
            },
            {
              colno: 69,
              filename: "http://localhost:4201/polyfills.js",
              function: "onScheduleTask",
              in_app: true,
              lineno: 368,
            },
            {
              colno: 30,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 481,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "EventListener.handleEvent*customScheduleGlobal",
              in_app: true,
              lineno: 1869,
            },
            {
              colno: 31,
              filename: "http://localhost:4201/polyfills.js",
              function: "globalZoneAwareCallback",
              in_app: true,
              lineno: 1743,
            },
            {
              colno: 18,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 1717,
            },
            {
              colno: 38,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 576,
            },
            {
              colno: 51,
              filename: "http://localhost:4201/polyfills.js",
              function: "runTask",
              in_app: true,
              lineno: 263,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 494,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvokeTask",
              in_app: true,
              lineno: 47741,
            },
            {
              colno: 35,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 495,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "sentryWrapped",
              in_app: true,
              lineno: 79817,
            },
            {
              colno: 50,
              filename: "http://localhost:4201/vendor.js",
              function: "decoratePreventDefault/<",
              in_app: true,
              lineno: 53545,
            },
            {
              colno: 54,
              filename: "http://localhost:4201/vendor.js",
              function: "wrapListenerIn_markDirtyAndPreventDefault",
              in_app: true,
              lineno: 34488,
            },
            {
              colno: 16,
              filename: "http://localhost:4201/vendor.js",
              function: "executeListenerWithErrorHandling",
              in_app: true,
              lineno: 34453,
            },
            {
              colno: 146,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent_Template_button_click_23_listener",
              in_app: true,
              lineno: 221,
            },
            {
              colno: 9,
              filename: "http://localhost:4201/main.js",
              function: "throwSyntaxError",
              in_app: true,
              lineno: 155,
            },
            {
              filename: "http://localhost:4201/main.js",
              function: "eval",
              in_app: true,
              lineno: 155,
            },
          ],
        },
        mechanism: { handled: true, type: "generic" },
      },
    ],
  },
  level: "error",
  event_id: uniqueId(),
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: 1617119974.697,
  environment: environments.development,
  contexts: {
    trace: {
      op: "pageload",
      span_id: "b1c91194f8aeb446",
      status: "cancelled",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
        visibilitychange: "document.hidden",
      },
      trace_id: "b441f1a2469e40f998a0a22a9c33a4da",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617119800.24,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617119800.245,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617119800.258,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617119800.339,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617119800259",
        status_code: 200,
      },
      type: "http",
    },
    {
      timestamp: 1617119801.846,
      category: "sentry.event",
      event_id: "2dd83f0e558c43be8f74b6ac310e3cd7",
      level: "error",
      message: "RangeError: The number must be between 0 and 10.",
    },
    {
      timestamp: 1617119801.849,
      category: "sentry.event",
      event_id: "984c336e2767438da5cd62f26ad88862",
      level: "error",
      message: "RangeError: The number must be between 0 and 10.",
    },
    {
      timestamp: 1617119801.851,
      category: "console",
      data: {
        arguments: [
          {
            message: "The number must be between 0 and 10.",
            name: "RangeError",
            stack:
              "checkRange@http://localhost:4201/main.js:147:19\nAppComponent_Template_button_click_17_listener@http://localhost:4201/main.js:209:146\nexecuteListenerWithErrorHandling@http://localhost:4201/vendor.js:34453:16\nwrapListenerIn_markDirtyAndPreventDefault@http://localhost:4201/vendor.js:34488:54\ndecoratePreventDefault/<@http://localhost:4201/vendor.js:53545:50\nsentryWrapped@http://localhost:4201/vendor.js:79817:23\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ninvokeTask@http://localhost:4201/polyfills.js:576:38\ninvokeTask@http://localhost:4201/polyfills.js:1717:18\nglobalZoneAwareCallback@http://localhost:4201/polyfills.js:1743:31\nEventListener.handleEvent*customScheduleGlobal@http://localhost:4201/polyfills.js:1869:47\nscheduleTask@http://localhost:4201/polyfills.js:481:30\nonScheduleTask@http://localhost:4201/polyfills.js:368:69\nscheduleTask@http://localhost:4201/polyfills.js:474:55\nscheduleTask@http://localhost:4201/polyfills.js:306:47\nscheduleEventTask@http://localhost:4201/polyfills.js:332:29\nmakeAddListener/<@http://localhost:4201/polyfills.js:2024:39\nwytX/TryCatch.prototype._wrapEventTarget/</<@http://localhost:4201/vendor.js:80294:33\ninstrumentDOM/</</<@http://localhost:4201/vendor.js:5038:33\naddEventListener@http://localhost:4201/vendor.js:53813:17\naddEventListener@http://localhost:4201/vendor.js:53358:23\nlisten@http://localhost:4201/vendor.js:53734:34\nlistenerInternal@http://localhost:4201/vendor.js:34408:44\nɵɵlistener@http://localhost:4201/vendor.js:34288:21\nAppComponent_Template@http://localhost:4201/main.js:209:52\nexecuteTemplate@http://localhost:4201/vendor.js:28782:19\nrenderView@http://localhost:4201/vendor.js:28589:28\nrenderComponent@http://localhost:4201/vendor.js:29864:15\nrenderChildComponents@http://localhost:4201/vendor.js:28454:24\nrenderView@http://localhost:4201/vendor.js:28614:34\ncreate@http://localhost:4201/vendor.js:44309:23\nbootstrap@http://localhost:4201/vendor.js:48687:42\n_moduleDoBootstrap/<@http://localhost:4201/vendor.js:48400:64\n_moduleDoBootstrap@http://localhost:4201/vendor.js:48400:44\nbootstrapModuleFactory/</</<@http://localhost:4201/vendor.js:48370:26\ninvoke@http://localhost:4201/polyfills.js:460:30\nonInvoke@http://localhost:4201/vendor.js:47753:33\ninvoke@http://localhost:4201/polyfills.js:459:36\nrun@http://localhost:4201/polyfills.js:219:47\nscheduleResolveOrReject/<@http://localhost:4201/polyfills.js:953:40\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ndrainMicroTaskQueue@http://localhost:4201/polyfills.js:665:39\n",
          },
        ],
        logger: "console",
      },
      level: "error",
      message: "RangeError: The number must be between 0 and 10.",
    },
    {
      timestamp: 1617119801.852,
      category: "ui.click",
      message: "body > app-root > ol > li > button",
    },
    {
      timestamp: 1617119948.814,
      category: "sentry.event",
      event_id: "76879380a28f49c3af3dc5ab09f3f688",
      level: "error",
      message: "ReferenceError: undefinedVariable is not defined",
    },
    {
      timestamp: 1617119948.818,
      category: "sentry.event",
      event_id: "d1d28a88ed8a49c2b5169399bd01fe4d",
      level: "error",
      message: "ReferenceError: undefinedVariable is not defined",
    },
    {
      timestamp: 1617119948.82,
      category: "console",
      data: {
        arguments: [
          {
            message: "undefinedVariable is not defined",
            name: "ReferenceError",
            stack:
              "throwReferenceError@http://localhost:4201/main.js:152:17\nAppComponent_Template_button_click_20_listener@http://localhost:4201/main.js:215:146\nexecuteListenerWithErrorHandling@http://localhost:4201/vendor.js:34453:16\nwrapListenerIn_markDirtyAndPreventDefault@http://localhost:4201/vendor.js:34488:54\ndecoratePreventDefault/<@http://localhost:4201/vendor.js:53545:50\nsentryWrapped@http://localhost:4201/vendor.js:79817:23\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ninvokeTask@http://localhost:4201/polyfills.js:576:38\ninvokeTask@http://localhost:4201/polyfills.js:1717:18\nglobalZoneAwareCallback@http://localhost:4201/polyfills.js:1743:31\nEventListener.handleEvent*customScheduleGlobal@http://localhost:4201/polyfills.js:1869:47\nscheduleTask@http://localhost:4201/polyfills.js:481:30\nonScheduleTask@http://localhost:4201/polyfills.js:368:69\nscheduleTask@http://localhost:4201/polyfills.js:474:55\nscheduleTask@http://localhost:4201/polyfills.js:306:47\nscheduleEventTask@http://localhost:4201/polyfills.js:332:29\nmakeAddListener/<@http://localhost:4201/polyfills.js:2024:39\nwytX/TryCatch.prototype._wrapEventTarget/</<@http://localhost:4201/vendor.js:80294:33\ninstrumentDOM/</</<@http://localhost:4201/vendor.js:5038:33\naddEventListener@http://localhost:4201/vendor.js:53813:17\naddEventListener@http://localhost:4201/vendor.js:53358:23\nlisten@http://localhost:4201/vendor.js:53734:34\nlistenerInternal@http://localhost:4201/vendor.js:34408:44\nɵɵlistener@http://localhost:4201/vendor.js:34288:21\nAppComponent_Template@http://localhost:4201/main.js:215:52\nexecuteTemplate@http://localhost:4201/vendor.js:28782:19\nrenderView@http://localhost:4201/vendor.js:28589:28\nrenderComponent@http://localhost:4201/vendor.js:29864:15\nrenderChildComponents@http://localhost:4201/vendor.js:28454:24\nrenderView@http://localhost:4201/vendor.js:28614:34\ncreate@http://localhost:4201/vendor.js:44309:23\nbootstrap@http://localhost:4201/vendor.js:48687:42\n_moduleDoBootstrap/<@http://localhost:4201/vendor.js:48400:64\n_moduleDoBootstrap@http://localhost:4201/vendor.js:48400:44\nbootstrapModuleFactory/</</<@http://localhost:4201/vendor.js:48370:26\ninvoke@http://localhost:4201/polyfills.js:460:30\nonInvoke@http://localhost:4201/vendor.js:47753:33\ninvoke@http://localhost:4201/polyfills.js:459:36\nrun@http://localhost:4201/polyfills.js:219:47\nscheduleResolveOrReject/<@http://localhost:4201/polyfills.js:953:40\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ndrainMicroTaskQueue@http://localhost:4201/polyfills.js:665:39\n",
          },
        ],
        logger: "console",
      },
      level: "error",
      message: "ReferenceError: undefinedVariable is not defined",
    },
    {
      timestamp: 1617119948.822,
      category: "ui.click",
      message: "body > app-root > ol > li > button",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
    },
  },
};

export const jsUriError = {
  exception: {
    values: [
      {
        type: "URIError",
        value: "malformed URI sequence",
        stacktrace: {
          frames: [
            {
              colno: 39,
              filename: "http://localhost:4201/polyfills.js",
              function: "drainMicroTaskQueue",
              in_app: true,
              lineno: 665,
            },
            {
              colno: 51,
              filename: "http://localhost:4201/polyfills.js",
              function: "runTask",
              in_app: true,
              lineno: 263,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 494,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvokeTask",
              in_app: true,
              lineno: 47741,
            },
            {
              colno: 35,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 495,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleResolveOrReject/<",
              in_app: true,
              lineno: 953,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "run",
              in_app: true,
              lineno: 219,
            },
            {
              colno: 36,
              filename: "http://localhost:4201/polyfills.js",
              function: "invoke",
              in_app: true,
              lineno: 459,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvoke",
              in_app: true,
              lineno: 47753,
            },
            {
              colno: 30,
              filename: "http://localhost:4201/polyfills.js",
              function: "invoke",
              in_app: true,
              lineno: 460,
            },
            {
              colno: 26,
              filename: "http://localhost:4201/vendor.js",
              function: "bootstrapModuleFactory/</</<",
              in_app: true,
              lineno: 48370,
            },
            {
              colno: 44,
              filename: "http://localhost:4201/vendor.js",
              function: "_moduleDoBootstrap",
              in_app: true,
              lineno: 48400,
            },
            {
              colno: 64,
              filename: "http://localhost:4201/vendor.js",
              function: "_moduleDoBootstrap/<",
              in_app: true,
              lineno: 48400,
            },
            {
              colno: 42,
              filename: "http://localhost:4201/vendor.js",
              function: "bootstrap",
              in_app: true,
              lineno: 48687,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "create",
              in_app: true,
              lineno: 44309,
            },
            {
              colno: 34,
              filename: "http://localhost:4201/vendor.js",
              function: "renderView",
              in_app: true,
              lineno: 28614,
            },
            {
              colno: 24,
              filename: "http://localhost:4201/vendor.js",
              function: "renderChildComponents",
              in_app: true,
              lineno: 28454,
            },
            {
              colno: 15,
              filename: "http://localhost:4201/vendor.js",
              function: "renderComponent",
              in_app: true,
              lineno: 29864,
            },
            {
              colno: 28,
              filename: "http://localhost:4201/vendor.js",
              function: "renderView",
              in_app: true,
              lineno: 28589,
            },
            {
              colno: 19,
              filename: "http://localhost:4201/vendor.js",
              function: "executeTemplate",
              in_app: true,
              lineno: 28782,
            },
            {
              colno: 52,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent_Template",
              in_app: true,
              lineno: 227,
            },
            {
              colno: 21,
              filename: "http://localhost:4201/vendor.js",
              function: "ɵɵlistener",
              in_app: true,
              lineno: 34288,
            },
            {
              colno: 44,
              filename: "http://localhost:4201/vendor.js",
              function: "listenerInternal",
              in_app: true,
              lineno: 34408,
            },
            {
              colno: 34,
              filename: "http://localhost:4201/vendor.js",
              function: "listen",
              in_app: true,
              lineno: 53734,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "addEventListener",
              in_app: true,
              lineno: 53358,
            },
            {
              colno: 17,
              filename: "http://localhost:4201/vendor.js",
              function: "addEventListener",
              in_app: true,
              lineno: 53813,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "instrumentDOM/</</<",
              in_app: true,
              lineno: 5038,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "wytX/TryCatch.prototype._wrapEventTarget/</<",
              in_app: true,
              lineno: 80294,
            },
            {
              colno: 39,
              filename: "http://localhost:4201/polyfills.js",
              function: "makeAddListener/<",
              in_app: true,
              lineno: 2024,
            },
            {
              colno: 29,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleEventTask",
              in_app: true,
              lineno: 332,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 306,
            },
            {
              colno: 55,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 474,
            },
            {
              colno: 69,
              filename: "http://localhost:4201/polyfills.js",
              function: "onScheduleTask",
              in_app: true,
              lineno: 368,
            },
            {
              colno: 30,
              filename: "http://localhost:4201/polyfills.js",
              function: "scheduleTask",
              in_app: true,
              lineno: 481,
            },
            {
              colno: 47,
              filename: "http://localhost:4201/polyfills.js",
              function: "EventListener.handleEvent*customScheduleGlobal",
              in_app: true,
              lineno: 1869,
            },
            {
              colno: 31,
              filename: "http://localhost:4201/polyfills.js",
              function: "globalZoneAwareCallback",
              in_app: true,
              lineno: 1743,
            },
            {
              colno: 18,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 1717,
            },
            {
              colno: 38,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 576,
            },
            {
              colno: 51,
              filename: "http://localhost:4201/polyfills.js",
              function: "runTask",
              in_app: true,
              lineno: 263,
            },
            {
              colno: 40,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 494,
            },
            {
              colno: 33,
              filename: "http://localhost:4201/vendor.js",
              function: "onInvokeTask",
              in_app: true,
              lineno: 47741,
            },
            {
              colno: 35,
              filename: "http://localhost:4201/polyfills.js",
              function: "invokeTask",
              in_app: true,
              lineno: 495,
            },
            {
              colno: 23,
              filename: "http://localhost:4201/vendor.js",
              function: "sentryWrapped",
              in_app: true,
              lineno: 79817,
            },
            {
              colno: 50,
              filename: "http://localhost:4201/vendor.js",
              function: "decoratePreventDefault/<",
              in_app: true,
              lineno: 53545,
            },
            {
              colno: 54,
              filename: "http://localhost:4201/vendor.js",
              function: "wrapListenerIn_markDirtyAndPreventDefault",
              in_app: true,
              lineno: 34488,
            },
            {
              colno: 16,
              filename: "http://localhost:4201/vendor.js",
              function: "executeListenerWithErrorHandling",
              in_app: true,
              lineno: 34453,
            },
            {
              colno: 146,
              filename: "http://localhost:4201/main.js",
              function: "AppComponent_Template_button_click_26_listener",
              in_app: true,
              lineno: 227,
            },
            {
              colno: 27,
              filename: "http://localhost:4201/main.js",
              function: "throwUriError",
              in_app: true,
              lineno: 158,
            },
          ],
        },
        mechanism: { handled: true, type: "generic" },
      },
    ],
  },
  level: "error",
  event_id: uniqueId(),
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: 1617119993.442,
  contexts: {
    trace: {
      op: "pageload",
      span_id: "b1c91194f8aeb446",
      status: "cancelled",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
        visibilitychange: "document.hidden",
      },
      trace_id: "b441f1a2469e40f998a0a22a9c33a4da",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617119800.24,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617119800.245,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617119800.258,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617119800.339,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617119800259",
        status_code: 200,
      },
      type: "http",
    },
    {
      timestamp: 1617119801.846,
      category: "sentry.event",
      event_id: "2dd83f0e558c43be8f74b6ac310e3cd7",
      level: "error",
      message: "RangeError: The number must be between 0 and 10.",
    },
    {
      timestamp: 1617119801.849,
      category: "sentry.event",
      event_id: "984c336e2767438da5cd62f26ad88862",
      level: "error",
      message: "RangeError: The number must be between 0 and 10.",
    },
    {
      timestamp: 1617119801.851,
      category: "console",
      data: {
        arguments: [
          {
            message: "The number must be between 0 and 10.",
            name: "RangeError",
            stack:
              "checkRange@http://localhost:4201/main.js:147:19\nAppComponent_Template_button_click_17_listener@http://localhost:4201/main.js:209:146\nexecuteListenerWithErrorHandling@http://localhost:4201/vendor.js:34453:16\nwrapListenerIn_markDirtyAndPreventDefault@http://localhost:4201/vendor.js:34488:54\ndecoratePreventDefault/<@http://localhost:4201/vendor.js:53545:50\nsentryWrapped@http://localhost:4201/vendor.js:79817:23\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ninvokeTask@http://localhost:4201/polyfills.js:576:38\ninvokeTask@http://localhost:4201/polyfills.js:1717:18\nglobalZoneAwareCallback@http://localhost:4201/polyfills.js:1743:31\nEventListener.handleEvent*customScheduleGlobal@http://localhost:4201/polyfills.js:1869:47\nscheduleTask@http://localhost:4201/polyfills.js:481:30\nonScheduleTask@http://localhost:4201/polyfills.js:368:69\nscheduleTask@http://localhost:4201/polyfills.js:474:55\nscheduleTask@http://localhost:4201/polyfills.js:306:47\nscheduleEventTask@http://localhost:4201/polyfills.js:332:29\nmakeAddListener/<@http://localhost:4201/polyfills.js:2024:39\nwytX/TryCatch.prototype._wrapEventTarget/</<@http://localhost:4201/vendor.js:80294:33\ninstrumentDOM/</</<@http://localhost:4201/vendor.js:5038:33\naddEventListener@http://localhost:4201/vendor.js:53813:17\naddEventListener@http://localhost:4201/vendor.js:53358:23\nlisten@http://localhost:4201/vendor.js:53734:34\nlistenerInternal@http://localhost:4201/vendor.js:34408:44\nɵɵlistener@http://localhost:4201/vendor.js:34288:21\nAppComponent_Template@http://localhost:4201/main.js:209:52\nexecuteTemplate@http://localhost:4201/vendor.js:28782:19\nrenderView@http://localhost:4201/vendor.js:28589:28\nrenderComponent@http://localhost:4201/vendor.js:29864:15\nrenderChildComponents@http://localhost:4201/vendor.js:28454:24\nrenderView@http://localhost:4201/vendor.js:28614:34\ncreate@http://localhost:4201/vendor.js:44309:23\nbootstrap@http://localhost:4201/vendor.js:48687:42\n_moduleDoBootstrap/<@http://localhost:4201/vendor.js:48400:64\n_moduleDoBootstrap@http://localhost:4201/vendor.js:48400:44\nbootstrapModuleFactory/</</<@http://localhost:4201/vendor.js:48370:26\ninvoke@http://localhost:4201/polyfills.js:460:30\nonInvoke@http://localhost:4201/vendor.js:47753:33\ninvoke@http://localhost:4201/polyfills.js:459:36\nrun@http://localhost:4201/polyfills.js:219:47\nscheduleResolveOrReject/<@http://localhost:4201/polyfills.js:953:40\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ndrainMicroTaskQueue@http://localhost:4201/polyfills.js:665:39\n",
          },
        ],
        logger: "console",
      },
      level: "error",
      message: "RangeError: The number must be between 0 and 10.",
    },
    {
      timestamp: 1617119801.852,
      category: "ui.click",
      message: "body > app-root > ol > li > button",
    },
    {
      timestamp: 1617119948.814,
      category: "sentry.event",
      event_id: "76879380a28f49c3af3dc5ab09f3f688",
      level: "error",
      message: "ReferenceError: undefinedVariable is not defined",
    },
    {
      timestamp: 1617119948.818,
      category: "sentry.event",
      event_id: "d1d28a88ed8a49c2b5169399bd01fe4d",
      level: "error",
      message: "ReferenceError: undefinedVariable is not defined",
    },
    {
      timestamp: 1617119948.82,
      category: "console",
      data: {
        arguments: [
          {
            message: "undefinedVariable is not defined",
            name: "ReferenceError",
            stack:
              "throwReferenceError@http://localhost:4201/main.js:152:17\nAppComponent_Template_button_click_20_listener@http://localhost:4201/main.js:215:146\nexecuteListenerWithErrorHandling@http://localhost:4201/vendor.js:34453:16\nwrapListenerIn_markDirtyAndPreventDefault@http://localhost:4201/vendor.js:34488:54\ndecoratePreventDefault/<@http://localhost:4201/vendor.js:53545:50\nsentryWrapped@http://localhost:4201/vendor.js:79817:23\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ninvokeTask@http://localhost:4201/polyfills.js:576:38\ninvokeTask@http://localhost:4201/polyfills.js:1717:18\nglobalZoneAwareCallback@http://localhost:4201/polyfills.js:1743:31\nEventListener.handleEvent*customScheduleGlobal@http://localhost:4201/polyfills.js:1869:47\nscheduleTask@http://localhost:4201/polyfills.js:481:30\nonScheduleTask@http://localhost:4201/polyfills.js:368:69\nscheduleTask@http://localhost:4201/polyfills.js:474:55\nscheduleTask@http://localhost:4201/polyfills.js:306:47\nscheduleEventTask@http://localhost:4201/polyfills.js:332:29\nmakeAddListener/<@http://localhost:4201/polyfills.js:2024:39\nwytX/TryCatch.prototype._wrapEventTarget/</<@http://localhost:4201/vendor.js:80294:33\ninstrumentDOM/</</<@http://localhost:4201/vendor.js:5038:33\naddEventListener@http://localhost:4201/vendor.js:53813:17\naddEventListener@http://localhost:4201/vendor.js:53358:23\nlisten@http://localhost:4201/vendor.js:53734:34\nlistenerInternal@http://localhost:4201/vendor.js:34408:44\nɵɵlistener@http://localhost:4201/vendor.js:34288:21\nAppComponent_Template@http://localhost:4201/main.js:215:52\nexecuteTemplate@http://localhost:4201/vendor.js:28782:19\nrenderView@http://localhost:4201/vendor.js:28589:28\nrenderComponent@http://localhost:4201/vendor.js:29864:15\nrenderChildComponents@http://localhost:4201/vendor.js:28454:24\nrenderView@http://localhost:4201/vendor.js:28614:34\ncreate@http://localhost:4201/vendor.js:44309:23\nbootstrap@http://localhost:4201/vendor.js:48687:42\n_moduleDoBootstrap/<@http://localhost:4201/vendor.js:48400:64\n_moduleDoBootstrap@http://localhost:4201/vendor.js:48400:44\nbootstrapModuleFactory/</</<@http://localhost:4201/vendor.js:48370:26\ninvoke@http://localhost:4201/polyfills.js:460:30\nonInvoke@http://localhost:4201/vendor.js:47753:33\ninvoke@http://localhost:4201/polyfills.js:459:36\nrun@http://localhost:4201/polyfills.js:219:47\nscheduleResolveOrReject/<@http://localhost:4201/polyfills.js:953:40\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ndrainMicroTaskQueue@http://localhost:4201/polyfills.js:665:39\n",
          },
        ],
        logger: "console",
      },
      level: "error",
      message: "ReferenceError: undefinedVariable is not defined",
    },
    {
      timestamp: 1617119948.822,
      category: "ui.click",
      message: "body > app-root > ol > li > button",
    },
    {
      timestamp: 1617119974.699,
      category: "sentry.event",
      event_id: "0a1c63f986d8476fb88d4efa5382c7af",
      level: "error",
      message: "ReferenceError: nope is not defined",
    },
    {
      timestamp: 1617119974.705,
      category: "sentry.event",
      event_id: "7dcf0e7f62b54ebdb0fb9938a0501d09",
      level: "error",
      message: "ReferenceError: nope is not defined",
    },
    {
      timestamp: 1617119974.708,
      category: "console",
      data: {
        arguments: [
          {
            message: "nope is not defined",
            name: "ReferenceError",
            stack:
              "@http://localhost:4201/main.js line 155 > eval:1:1\nthrowSyntaxError@http://localhost:4201/main.js:155:9\nAppComponent_Template_button_click_23_listener@http://localhost:4201/main.js:221:146\nexecuteListenerWithErrorHandling@http://localhost:4201/vendor.js:34453:16\nwrapListenerIn_markDirtyAndPreventDefault@http://localhost:4201/vendor.js:34488:54\ndecoratePreventDefault/<@http://localhost:4201/vendor.js:53545:50\nsentryWrapped@http://localhost:4201/vendor.js:79817:23\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ninvokeTask@http://localhost:4201/polyfills.js:576:38\ninvokeTask@http://localhost:4201/polyfills.js:1717:18\nglobalZoneAwareCallback@http://localhost:4201/polyfills.js:1743:31\nEventListener.handleEvent*customScheduleGlobal@http://localhost:4201/polyfills.js:1869:47\nscheduleTask@http://localhost:4201/polyfills.js:481:30\nonScheduleTask@http://localhost:4201/polyfills.js:368:69\nscheduleTask@http://localhost:4201/polyfills.js:474:55\nscheduleTask@http://localhost:4201/polyfills.js:306:47\nscheduleEventTask@http://localhost:4201/polyfills.js:332:29\nmakeAddListener/<@http://localhost:4201/polyfills.js:2024:39\nwytX/TryCatch.prototype._wrapEventTarget/</<@http://localhost:4201/vendor.js:80294:33\ninstrumentDOM/</</<@http://localhost:4201/vendor.js:5038:33\naddEventListener@http://localhost:4201/vendor.js:53813:17\naddEventListener@http://localhost:4201/vendor.js:53358:23\nlisten@http://localhost:4201/vendor.js:53734:34\nlistenerInternal@http://localhost:4201/vendor.js:34408:44\nɵɵlistener@http://localhost:4201/vendor.js:34288:21\nAppComponent_Template@http://localhost:4201/main.js:221:52\nexecuteTemplate@http://localhost:4201/vendor.js:28782:19\nrenderView@http://localhost:4201/vendor.js:28589:28\nrenderComponent@http://localhost:4201/vendor.js:29864:15\nrenderChildComponents@http://localhost:4201/vendor.js:28454:24\nrenderView@http://localhost:4201/vendor.js:28614:34\ncreate@http://localhost:4201/vendor.js:44309:23\nbootstrap@http://localhost:4201/vendor.js:48687:42\n_moduleDoBootstrap/<@http://localhost:4201/vendor.js:48400:64\n_moduleDoBootstrap@http://localhost:4201/vendor.js:48400:44\nbootstrapModuleFactory/</</<@http://localhost:4201/vendor.js:48370:26\ninvoke@http://localhost:4201/polyfills.js:460:30\nonInvoke@http://localhost:4201/vendor.js:47753:33\ninvoke@http://localhost:4201/polyfills.js:459:36\nrun@http://localhost:4201/polyfills.js:219:47\nscheduleResolveOrReject/<@http://localhost:4201/polyfills.js:953:40\ninvokeTask@http://localhost:4201/polyfills.js:495:35\nonInvokeTask@http://localhost:4201/vendor.js:47741:33\ninvokeTask@http://localhost:4201/polyfills.js:494:40\nrunTask@http://localhost:4201/polyfills.js:263:51\ndrainMicroTaskQueue@http://localhost:4201/polyfills.js:665:39\n",
          },
        ],
        logger: "console",
      },
      level: "error",
      message: "ReferenceError: nope is not defined",
    },
    {
      timestamp: 1617119974.71,
      category: "ui.click",
      message: "body > app-root > ol > li > button",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
    },
  },
};

export const generateErrors = (url: string, count: number) => {
  for (let i = 0; i < count; i++) {
    cy.request("POST", url, jsError());
  }
};

const userAgents: { [key: string]: string } = {
  ubuntuFirefox:
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
  ubuntuChrome:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
  windowsChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
  macOSSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
  iOSSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  windowsOpera:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36 OPR/74.0.3911.218",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36",
};

const randomUserAgent = () => {
  const keys = Object.keys(userAgents);
  const random = Math.floor(Math.random() * keys.length);
  return userAgents[keys[random]];
};

export const jsError = () => ({
  message: "A Generic Error",
  exception: {
    values: [
      {
        value: "A Generic Error",
        type: "Error",
        mechanism: { synthetic: true, handled: true, type: "generic" },
      },
    ],
  },
  level: "error",
  event_id: uniqueId(),
  platform: "javascript",
  sdk: {
    name: "sentry.javascript.browser",
    packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
    version: "5.29.2",
    integrations: [
      "InboundFilters",
      "FunctionToString",
      "TryCatch",
      "Breadcrumbs",
      "GlobalHandlers",
      "LinkedErrors",
      "UserAgent",
      "BrowserTracing",
    ],
  },
  timestamp: Date.now() / 1000,
  contexts: {
    trace: {
      op: "pageload",
      span_id: "8e2b111ba056f7b5",
      tags: {
        __sentry_samplingMethod: "client_sampler",
        __sentry_sampleRate: "0",
      },
      trace_id: "1179b08e3ec14455836d323ab9af1d86",
    },
  },
  tags: { transaction: "/" },
  breadcrumbs: [
    {
      timestamp: 1617135472.93,
      category: "console",
      data: {
        arguments: [
          "Angular is running in development mode. Call enableProdMode() to enable production mode.",
        ],
        logger: "console",
      },
      level: "log",
      message:
        "Angular is running in development mode. Call enableProdMode() to enable production mode.",
    },
    {
      timestamp: 1617135472.935,
      category: "navigation",
      data: { from: "/", to: "/" },
    },
    {
      timestamp: 1617135472.946,
      category: "ui.click",
      message: "body > app-root > ol > li > a",
    },
    {
      timestamp: 1617135472.975,
      category: "xhr",
      data: {
        method: "GET",
        url: "http://localhost:4201/sockjs-node/info?t=1617135472946",
        status_code: 200,
      },
      type: "http",
    },
  ],
  request: {
    url: "http://localhost:4201/",
    headers: { "User-Agent": randomUserAgent() },
  },
});

export const generateIssues = (url: string, count: number) => {
  for (let i = 0; i < count; i++) {
    cy.request("POST", url, uniqueInfoLog());
  }
};

export const uniqueInfoLog = () => {
  const unique = uniqueId(6);
  return {
    message: `What I'm really trying to say is: ${unique}`,
    level: "info",
    event_id: uniqueId(),
    platform: "javascript",
    sdk: {
      name: "sentry.javascript.browser",
      packages: [{ name: "npm:@sentry/browser", version: "5.29.2" }],
      version: "5.29.2",
      integrations: [
        "InboundFilters",
        "FunctionToString",
        "TryCatch",
        "Breadcrumbs",
        "GlobalHandlers",
        "LinkedErrors",
        "UserAgent",
        "BrowserTracing",
      ],
    },
    timestamp: Date.now() / 1000,
    contexts: {},
    tags: { transaction: "/" },
    breadcrumbs: [],
    request: {
      url: "http://localhost:4201/",
      headers: { "User-Agent": randomUserAgent() },
    },
  };
};

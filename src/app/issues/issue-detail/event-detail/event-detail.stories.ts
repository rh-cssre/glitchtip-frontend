import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, select } from "@storybook/addon-knobs";
import { of } from "rxjs";

import { SharedModule } from "../../../shared/shared.module";

// Components
import { EntryRequestComponent } from "../event-detail/entry-request/entry-request.component";
import { EntryCSPComponent } from "./entry-csp/entry-csp.component";
import { EntryMessageComponent } from "./entry-message/entry-message.component";
import { EntryExceptionComponent } from "./entry-exception/entry-exception.component";
import { FrameTitleComponent } from "./entry-exception/frame-title/frame-title.component";

// Data
import { databaseError } from "./test-data/database-error";
import { databaseStackError } from "./test-data/database-stack-error";
import { postError } from "./test-data/post-error";
import { templateError } from "./test-data/template-error";
import { zeroDivisionError } from "./test-data/zero-division-error";
import { stringError } from "./test-data/string-error";
import { cspError } from "./test-data/csp-error";
import { pageNotFound } from "./test-data/page-not-found";
import { socialApp } from "./test-data/social-app";
import { zeroDivisionDotnet } from "./test-data/zero-division-dotnet";
import { FrameExpandedComponent } from "./entry-exception/frame-expanded/frame-expanded.component";
import { RawStacktraceComponent } from "./entry-exception/raw-stacktrace/raw-stacktrace.component";
import { ContextsComponent } from "./context/contexts.component";

export default {
  title: "Events/Event Detail",
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [
        EntryRequestComponent,
        EntryCSPComponent,
        EntryMessageComponent,
        EntryExceptionComponent,
        FrameTitleComponent,
        FrameExpandedComponent,
        RawStacktraceComponent,
        ContextsComponent,
      ],
    }),
    withKnobs,
  ],
};

export const EntryRequest = () => {
  const errorOptions = [
    "Post Error",
    "Database Error",
    "Database Stack Error",
    "Template Error",
    "Zero Division Error",
    "String Error",
    "CSP Error",
    "Page Not Found",
    "SocialApp.DoesNotExist",
  ];

  const selectedError = select("Error Type", errorOptions, errorOptions[0]);
  let stackError: any = postError.entries[1].data;
  let error: any = {
    ...stackError,
    domainName: "localhost",
    path: "/database-stack-error/",
  };
  let bodyData: any = [
    [
      "csrfmiddlewaretoken",
      "184VTEFb5oyMNrInUlX5Yxj6EuTllb7IiQ9axkeCcqKYrG4PKkXJnn1RrGRdcJ3z",
    ],
    ["param1", "val"],
  ];

  switch (selectedError) {
    case "Database Error":
      stackError = databaseError.entries[2].data;
      error = {
        ...stackError,
        domainName: "localhost",
        path: "/database-error/",
      };
      bodyData = null;
      break;
    case "Database Stack Error":
      stackError = databaseStackError.entries[2].data;
      error = {
        ...stackError,
        domainName: "localhost",
        path: "/database-stack-error/",
      };
      bodyData = null;
      break;
    case "Post Error":
      stackError = postError.entries[1].data;
      error = {
        ...stackError,
        domainName: "localhost",
        path: "/database-stack-error/",
      };
      bodyData = [
        [
          "csrfmiddlewaretoken",
          "184VTEFb5oyMNrInUlX5Yxj6EuTllb7IiQ9axkeCcqKYrG4PKkXJnn1RrGRdcJ3z",
        ],
        ["param1", "val"],
      ];
      break;
    case "Template Error":
      stackError = templateError.entries[1].data;
      error = {
        ...stackError,
        domainName: "localhost",
        path: "/template-error/",
      };
      bodyData = null;
      break;
    case "Zero Division Error":
      stackError = zeroDivisionError.entries[1].data;
      error = {
        ...stackError,
        domainName: "localhost",
        path: "/divide-zero/",
      };
      bodyData = null;
      break;
    case "String Error":
      stackError = stringError.entries[2].data;
      error = {
        ...stackError,
        domainName: "localhost",
        path: "/",
      };
      bodyData = null;
      break;
    case "CSP Error":
      stackError = cspError.entries[2].data;
      error = {
        ...stackError,
        domainName: "www.website.com",
        path: "/about-us/our-staff",
      };
      bodyData = null;
      break;
    case "Page Not Found":
      stackError = pageNotFound.entries[0].data;
      error = {
        ...stackError,
        domainName: "localhost",
        path: "/message/",
      };
      break;
    case "SocialApp.DoesNotExist":
      stackError = socialApp.entries[1].data;
      error = {
        ...stackError,
        domainName: "staging.glitchtip.com",
        path: "/rest-auth/gitlab/",
      };
      bodyData = [
        [
          "access_token",
          "7e6d28e705369c544138248b3bbdc575b5698ec13c21f7e67482c2553a536007",
        ],
      ];
      break;
  }

  return {
    component: EntryRequestComponent,
    props: {
      eventEntryRequest$: of(error),
      requestDataArray$: of(bodyData),
    },
  };
};

EntryRequest.story = {
  name: "Entry Request",
};

export const EntryCSP = () => {
  return {
    component: EntryCSPComponent,
    props: {
      eventEntryCSP$: of(cspError.entries[1].data),
    },
  };
};

EntryCSP.story = {
  name: "Entry CSP",
};

export const EntryMessage = () => {
  return {
    component: EntryMessageComponent,
    props: {
      eventEntryMessage$: of(cspError.entries[0].data),
    },
  };
};

EntryMessage.story = {
  name: "Entry Message",
};

export const EntryException = () => {
  const errorOptions = [
    "Database Error",
    "Database Stack Error",
    "Post Error",
    "Template Error",
    "Zero Division Error",
    "Zero Division Dotnet",
    "String Error",
    "SocialApp.DoesNotExist",
  ];
  const selectedError = select("Error Type", errorOptions, errorOptions[0]);
  let error: any = databaseError.entries[0].data;
  let title: string = databaseError.title;
  let platform: string = databaseError.platform;

  switch (selectedError) {
    case "Database Error":
      error = databaseError.entries[0].data;
      title = databaseError.title;
      platform = databaseError.platform;
      break;
    case "Database Stack Error":
      error = databaseStackError.entries[0].data;
      title = databaseStackError.title;
      platform = databaseStackError.platform;
      break;
    case "Post Error":
      error = postError.entries[0].data;
      title = postError.title;
      platform = postError.platform;
      break;
    case "Template Error":
      error = templateError.entries[0].data;
      title = templateError.title;
      platform = templateError.platform;
      break;
    case "Zero Division Error":
      error = zeroDivisionError.entries[0].data;
      title = zeroDivisionError.title;
      platform = zeroDivisionError.platform;
      break;
    case "Zero Division Dotnet":
      error = zeroDivisionDotnet.entries[1].data;
      title = zeroDivisionDotnet.title;
      platform = zeroDivisionDotnet.platform;
      break;
    case "String Error":
      error = stringError.entries[0].data;
      title = stringError.title;
      platform = stringError.platform;
      break;
    case "SocialApp.DoesNotExist":
      error = socialApp.entries[0].data;
      title = socialApp.title;
      platform = socialApp.platform;
      break;
  }
  return {
    component: EntryExceptionComponent,
    props: {
      eventEntryException$: of(error),
      eventTitle: title,
      eventPlatform: platform,
    },
  };
};

EntryException.story = {
  name: "Entry Exception",
};

export const FrameTitle = () => {
  const frameTestData: any = {
    function: select("function", { NotNull: "inner", Null: null }, "inner"),
    colNo: select("colNo", { NotNull: 18, Zero: 0, Null: null }, 18),
    vars: {
      get_response:
        "<bound method BaseHandler._get_response of <django.core.handlers.wsgi.WSGIHandler object at 0x7f9c5109b580>>",
      request: "<WSGIRequest: GET '/divide-zero/'>",
      exc: "ZeroDivisionError('division by zero')",
    },
    symbol: null,
    module: select(
      "module",
      { NotNull: "django.core.handlers.exception", Null: null },
      "django.core.handlers.exception"
    ),
    lineNo: select("lineNo", { NotNull: 34, Null: null }, 34),
    trust: null,
    errors: null,
    package: "1.0.7",
    absPath: select(
      "absPath",
      {
        NotNull: "/code/errors/views.py",
        MatchFilename: "django/core/handlers/exception.py",
        MatchModule: "django.core.handlers.exception",
        IsURL: "http://bing.com",
        maliciousUrl: "javascript:alert('attack!')",
        Null: null,
      },
      null
    ),
    inApp: false,
    instructionAddr:
      "/usr/local/lib/python3.8/site-packages/django/core/handlers/exception.py",
    filename: select(
      "filename",
      { NotNull: "django/core/handlers/exception.py", Null: null },
      "django/core/handlers/exception.py"
    ),
    platform: select(
      "platform",
      { Python: "python", Java: "java", Null: null },
      null
    ),
    context: [
      [33, " try:"],
      [
        select(
          "contextLineNo",
          { ThirtyFour: 34, AnotherNumber: 117, Null: null },
          34
        ),
        " response = get_response(request)",
      ],
    ],
    symbolAddr: null,
  };

  return {
    component: FrameTitleComponent,
    props: {
      frame: frameTestData,
    },
  };
};

FrameTitle.story = {
  name: "Frame Title",
};

export const RawStacktrace = () => {
  const testValues: any = [
    {
      type: "System.DivideByZeroException",
      value: "Attempted to divide by zero.",
      module: "System.Runtime.CompilerServices.TaskAwaiter",
      stacktrace: {
        frames: [
          {
            function: select(
              "function",
              { NotNull: "inner", Null: null },
              "inner"
            ),
            colNo: select("colNo", { NotNull: 18, Zero: 0, Null: null }, 18),
            vars: {
              get_response:
                "<bound method BaseHandler._get_response of <django.core.handlers.wsgi.WSGIHandler object at 0x7f9c5109b580>>",
              request: "<WSGIRequest: GET '/divide-zero/'>",
              exc: "ZeroDivisionError('division by zero')",
            },
            symbol: null,
            module: select(
              "module",
              { NotNull: "django.core.handlers.exception", Null: null },
              "django.core.handlers.exception"
            ),
            lineNo: select("lineNo", { NotNull: 34, Null: null }, 34),
            trust: null,
            errors: null,
            package: select(
              "package",
              {
                NotNull: "/System/Library/Frameworks/UIKit.framework/UIKit",
                Null: null,
              },
              null
            ),
            absPath: null,
            inApp: false,
            instructionAddr: select(
              "instructionAddr",
              { NotNull: "0x000000019804aa20", Null: null },
              null
            ),
            filename: select(
              "module",
              { NotNull: "django/core/handlers/exception.py", Null: null },
              "django/core/handlers/exception.py"
            ),
            platform: null,
            context: [
              [33, " try:"],
              [
                select(
                  "contextLineNo",
                  { ThirtyFour: 34, AnotherNumber: 117, Null: null },
                  34
                ),
                " response = get_response(request)",
              ],
            ],
            symbolAddr: null,
          },
        ],
      },
    },
  ];

  return {
    component: RawStacktraceComponent,
    props: {
      rawStacktraceValues$: of(testValues),
      eventPlatform: select(
        "Select Platform",
        {
          javascript: "javascript",
          ruby: "ruby",
          php: "php",
          java: "java",
          cocoa: "cocoa",
          native: "native",
          default: "",
        },
        "javascript"
      ),
    },
  };
};

RawStacktrace.story = {
  name: "Raw Stacktrace Titles",
};

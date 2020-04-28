import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, select } from "@storybook/addon-knobs";
import { of } from "rxjs";

// Imports
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "src/app/shared/shared.module";

// Components
import { EventDetailComponent } from "./event-detail.component";
import { EntryRequestComponent } from "../event-detail/entry-request/entry-request.component";
import { EntryCSPComponent } from "./entry-csp/entry-csp.component";
import { EntryMessageComponent } from "./entry-message/entry-message.component";
import { EntryExceptionComponent } from "./entry-exception/entry-exception.component";

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

export default {
  title: "Event Detail",
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
      ],
    }),
    withKnobs,
  ],
};

export const EventDetails = () => {
  const errorOptions = [
    "Database Error",
    "Database Stack Error",
    "Post Error",
    "Template Error",
    "Zero Division Error",
    "Zero Division Dotnet",
    "String Error",
    "CSP Error",
    "Page Not Found",
    "SocialApp.DoesNotExist",
  ];
  const selectedError = select("Error Type", errorOptions, errorOptions[0]);
  let error: any = databaseError;

  switch (selectedError) {
    case "Database Error":
      error = databaseError;
      break;
    case "Database Stack Error":
      error = databaseStackError;
      break;
    case "Post Error":
      error = postError;
      break;
    case "Template Error":
      error = templateError;
      break;
    case "Zero Division Error":
      error = zeroDivisionError;
      break;
    case "Zero Division Dotnet":
      error = zeroDivisionDotnet;
      break;
    case "String Error":
      error = stringError;
      break;
    case "CSP Error":
      error = cspError;
      break;
    case "Page Not Found":
      error = pageNotFound;
      break;
    case "SocialApp.DoesNotExist":
      error = socialApp;
      break;
  }

  return {
    component: EventDetailComponent,
    props: {
      selectedError,
      event$: of(error),
      nextEvent$: of(boolean("has next event?", true)),
      previousEvent$: of(boolean("has previous event?", false)),
    },
  };
};

EventDetails.story = {
  name: "Event Detail",
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
        domainName: "www.revo.com",
        path: "/about-us/lens-replacement",
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

  switch (selectedError) {
    case "Database Error":
      error = databaseError.entries[0].data;
      title = databaseError.title;
      break;
    case "Database Stack Error":
      error = databaseStackError.entries[0].data;
      title = databaseStackError.title;
      break;
    case "Post Error":
      error = postError.entries[0].data;
      title = postError.title;
      break;
    case "Template Error":
      error = templateError.entries[0].data;
      title = templateError.title;
      break;
    case "Zero Division Error":
      error = zeroDivisionError.entries[0].data;
      title = zeroDivisionError.title;
      break;
    case "Zero Division Dotnet":
      error = zeroDivisionDotnet.entries[1].data;
      title = zeroDivisionDotnet.title;
      break;
    case "String Error":
      error = stringError.entries[0].data;
      title = stringError.title;
      break;
    case "SocialApp.DoesNotExist":
      error = socialApp.entries[0].data;
      title = socialApp.title;
      break;
  }
  return {
    component: EntryExceptionComponent,
    props: {
      eventEntryException$: of(error),
      eventTitle: title,
    },
  };
};

EntryException.story = {
  name: "Entry Exception",
};

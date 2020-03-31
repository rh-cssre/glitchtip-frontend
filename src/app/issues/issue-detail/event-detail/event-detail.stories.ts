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

export default {
  title: "Event Detail",
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      declarations: [
        EntryRequestComponent,
        EntryCSPComponent,
        EntryMessageComponent,
        EntryExceptionComponent
      ]
    }),
    withKnobs
  ]
};

export const EventDetails = () => {
  const errorOptions = [
    "Database Error",
    "Database Stack Error",
    "Post Error",
    "Template Error",
    "Zero Division Error",
    "String Error",
    "CSP Error",
    "Page Not Found",
    "SocialApp.DoesNotExist"
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
      previousEvent$: of(boolean("has previous event?", false))
    }
  };
};

EventDetails.story = {
  name: "Event Detail"
};

export const EntryRequest = () => {
  const stackError = databaseStackError.entries[2].data;
  const requestObject = {
    ...stackError,
    domainName: "localhost",
    path: "/database-stack-error/"
  };

  return {
    component: EntryRequestComponent,
    props: {
      eventEntryRequest$: of(requestObject)
    }
  };
};

EntryRequest.story = {
  name: "Entry Request"
};

export const EntryCSP = () => {
  return {
    component: EntryCSPComponent,
    props: {
      eventEntryCSP$: of(cspError.entries[1].data)
    }
  };
};

EntryCSP.story = {
  name: "Entry CSP"
};

export const EntryMessage = () => {
  return {
    component: EntryMessageComponent,
    props: {
      eventEntryMessage$: of(cspError.entries[0].data)
    }
  };
};

EntryMessage.story = {
  name: "Entry Message"
};

export const EntryException = () => {
  const errorOptions = [
    "Database Error",
    "Database Stack Error",
    "Post Error",
    "Template Error",
    "Zero Division Error",
    "String Error",
    "SocialApp.DoesNotExist"
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
      eventTitle: title
    }
  };
};

EntryException.story = {
  name: "Entry Exception"
};

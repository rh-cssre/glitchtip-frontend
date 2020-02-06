import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, select } from "@storybook/addon-knobs";
import { of } from "rxjs";

// Imports
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MaterialModule } from "src/app/shared/material.module";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "src/app/shared/shared.module";

// Components
import { EventDetailComponent } from "./event-detail.component";
import { EntryRequestComponent } from "../event-detail/entry-request/entry-request.component";

// Data
import { databaseError } from "./test-data/database-error";
import { databaseStackError } from "./test-data/database-stack-error";
import { postError } from "./test-data/post-error";
import { templateError } from "./test-data/template-error";
import { zeroDivisionError } from "./test-data/zero-division-error";
import { stringError } from "./test-data/string-error";
import { EntryDataComponent } from "./entry-data/entry-data.component";
import { cspError } from "./test-data/csp-error";

export default {
  title: "Event Detail",
  decorators: [
    moduleMetadata({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      declarations: [EntryRequestComponent, EntryDataComponent]
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
    "CSP Error"
  ];
  const selectedError = select("Error Type", errorOptions, errorOptions[0]);
  let error = databaseError;

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
  const error = databaseStackError.entries[2].data;
  const requestObject = {
    ...error,
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

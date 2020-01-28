import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, select } from "@storybook/addon-knobs";
import { EventDetailComponent } from "./event-detail.component";
import { MaterialModule } from "src/app/shared/material.module";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/app/shared/shared.module";

// Data
import { databaseError } from "./test-data/database-error";
import { databaseStackError } from "./test-data/database-stack-error";
import { postError } from "./test-data/post-error";
import { templateError } from "./test-data/template-error";
import { zeroDivisionError } from "./test-data/zero-division-error";
import { stringError } from "./test-data/string-error";

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
    "String Error"
  ];
  const selectedError = select("Error Type", errorOptions, errorOptions[0]);
  let error = databaseError;

  if (selectedError === "Database Error") {
    error = databaseError;
  }
  if (selectedError === "Database Stack Error") {
    error = databaseStackError;
  }
  if (selectedError === "PostError") {
    error = postError;
  }
  if (selectedError === "Template Error") {
    error = templateError;
  }
  if (selectedError === "Zero Division Error") {
    error = zeroDivisionError;
  }
  if (selectedError === "String Error") {
    error = stringError;
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

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

const eventTypeData = {
  databaseError: databaseError as any,
  databaseStackError: databaseStackError as any,
  postError: postError as any,
  templateError: templateError as any,
  zeroDivisionError: zeroDivisionError as any
};

export const EventDetail = () => ({
  component: EventDetailComponent,
  props: {
    event$: of(select("eventType", eventTypeData, databaseError)),
    nextEvent$: of(boolean("has next event?", true)),
    previousEvent$: of(boolean("has previous event?", false))
  }
});

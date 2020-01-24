import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { EventDetailComponent } from "./event-detail.component";
import { MaterialModule } from "src/app/shared/material.module";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "src/app/shared/shared.module";
import { latestEvent } from "./event-latest-test-data";

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

export const EventDetail = () => ({
  component: EventDetailComponent,
  props: {
    event$: of(latestEvent),
    nextEvent$: of(boolean("has next event?", true)),
    previousEvent$: of(boolean("has previous event?", false))
  }
});

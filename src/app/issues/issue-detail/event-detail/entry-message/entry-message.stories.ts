import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { of } from "rxjs";

import { SharedModule } from "src/app/shared/shared.module";
import { EntryMessageComponent } from "./entry-message.component";

import { cspError } from "../test-data/csp-error";

export default {
  title: "Events/Event Detail/Entry Message",
  component: EntryMessageComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
    }),
  ],
};

export const EntryMessage = () => {
  return {
    props: {
      eventEntryMessage$: of(cspError.entries[0].data),
    },
  };
};

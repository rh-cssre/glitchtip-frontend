import { moduleMetadata } from "@storybook/angular";
import { of } from "rxjs";

import { EntryMessageComponent } from "./entry-message.component";

import { cspError } from "../test-data/csp-error";
import { GlitchtipTestingModule } from "src/app/glitchtip-testing/glitchtip-testing.module";

export default {
  title: "Events/Event Detail/Entry Message",
  component: EntryMessageComponent,
  decorators: [
    moduleMetadata({
      imports: [GlitchtipTestingModule],
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

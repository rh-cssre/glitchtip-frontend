import { moduleMetadata } from "@storybook/angular";
import { of } from "rxjs";

import { EntryCSPComponent } from "./entry-csp.component";

import { cspError } from "../test-data/csp-error";
import { GlitchtipTestingModule } from "src/app/glitchtip-testing/glitchtip-testing.module";

export default {
  title: "Events/Event Detail/Entry CSP",
  component: EntryCSPComponent,
  decorators: [
    moduleMetadata({
      imports: [GlitchtipTestingModule],
    }),
  ],
};

export const EntryCSP = () => {
  return {
    props: {
      eventEntryCSP$: of(cspError.entries[1].data),
    },
  };
};

import { of } from "rxjs";

import { EntryMessageComponent } from "./entry-message.component";

import { cspError } from "../test-data/csp-error";

export default {
  title: "Events/Event Detail/Entry Message",
  component: EntryMessageComponent,
};

export const EntryMessage = () => {
  return {
    props: {
      eventEntryMessage$: of(cspError.entries[0].data),
    },
  };
};

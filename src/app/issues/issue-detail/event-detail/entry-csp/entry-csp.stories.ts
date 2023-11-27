import type { Meta, StoryObj } from "@storybook/angular";
import { of } from "rxjs";

import { EntryCSPComponent } from "./entry-csp.component";
import { cspError } from "../test-data/csp-error";

const meta: Meta<EntryCSPComponent> = {
  title: "Events/Event Detail/Entry CSP",
  component: EntryCSPComponent,
};

export default meta;
type Story = StoryObj<EntryCSPComponent>;

export const Primary: Story = {
  name: "Entry CSP",
  render: () => ({
    props: {
      eventEntryCSP$: of(cspError.entries[1].data),
    },
  }),
};

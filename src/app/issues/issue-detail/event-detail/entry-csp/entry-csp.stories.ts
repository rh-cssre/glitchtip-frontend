import type { Meta, StoryObj } from "@storybook/angular";

import { EntryCSPComponent } from "./entry-csp.component";
import { cspError } from "../test-data/csp-error";
import { signal } from "@angular/core";

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
      eventEntryCSP: signal(cspError.entries[1].data),
    },
  }),
};

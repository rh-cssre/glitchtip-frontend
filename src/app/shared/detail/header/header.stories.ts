import {
  Meta,
  StoryObj,
  applicationConfig,
} from "@storybook/angular";
import { provideRouter } from "@angular/router";
import { DetailHeaderComponent } from "./header.component";

const meta: Meta<DetailHeaderComponent> = {
  title: "Shared/Detail/Header Component",
  component: DetailHeaderComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
  render: (args: DetailHeaderComponent) => ({
    props: {
      ...args,
    },
  }),
};

export default meta;
type Story = StoryObj<DetailHeaderComponent>;

export const Default: Story = {
  args: { title: ["The Title", null], backLinkText: "Go back" },
};

export const Complex: Story = {
  args: {
    title: ["The Title", "with this"],
    subtitle: "Subtitle is here.",
    backLinkText: "Go back",
  },
  render: (args: DetailHeaderComponent) => ({
    props: {
      ...args,
    },
    template: `
    <gt-detail-header [title]="title" [subtitle]="subtitle" [backLinkText]="backLinkText">
      <button mat-button>Button</button>
    </gt-detail-header>`,
  }),
};

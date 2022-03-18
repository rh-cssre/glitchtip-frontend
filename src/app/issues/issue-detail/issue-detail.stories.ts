import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { moduleMetadata, Story } from "@storybook/angular";
import { SharedModule } from "../../shared/shared.module";
import { IssueDetailTitleComponent } from "./issue-detail-title/issue-detail-title.component";

export default {
  title: "Issues/Issues Detail",
  component: IssueDetailTitleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [IssueDetailTitleComponent],
    }),
  ],
  argTypes: {
    issueType: {
      options: ["error", "csp", "expectct", "whatever"],
      control: { type: "select" },
    },
    culprit: {
      options: ["this is the culprit", ""],
    },
    metadata: {
      table: {
        disable: true,
      },
    },
  },
};

const issueMetadata: any = {
  directive: "metadata directive",
  function: "metadata function",
  message: "metadata message",
  origin: "metadata origin",
  title: "metadata title",
  type: "metadata type",
  uri: "metadata uri",
  value: "metadata value",
};

export const Template: Story = (args) => ({
  props: {
    ...args,
    metadata: issueMetadata,
  },
});

export const Default = Template.bind({});
Default.args = {
  issueType: "error",
  culprit: "this is the culprit",
};

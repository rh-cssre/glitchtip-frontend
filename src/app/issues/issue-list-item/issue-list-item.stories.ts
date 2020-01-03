import { ReactiveFormsModule } from "@angular/forms";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { IssueListItemComponent } from "./issue-list-item.component";
import { sampleIssue } from "./sample-data";
import { MaterialModule } from "src/app/shared/material.module";

export default {
  title: "Issues List",
  decorators: [
    moduleMetadata({
      imports: [MaterialModule, ReactiveFormsModule]
    }),
    withKnobs
  ]
};

export const issueListItem = () => ({
  component: IssueListItemComponent,
  props: {
    title: sampleIssue.title
  }
});

issueListItem.story = {
  parameters: {
    notes:
      "Oh hey you can leave notes. Why is the alignment so weird though? Not sure if this is a great place to take notes."
  }
};

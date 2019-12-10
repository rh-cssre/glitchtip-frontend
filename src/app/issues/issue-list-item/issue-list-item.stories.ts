import { IssueListItemComponent } from "./issue-list-item.component";
import { sampleIssue } from "./sample-data";
import { MatCardModule } from "@angular/material/card";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";

export default {
  title: "Issues List",
  decorators: [
    moduleMetadata({
      imports: [MatCardModule]
    }),
    withKnobs
  ]
};

export const issueListItem = () => ({
  component: IssueListItemComponent,
  props: {
    title: sampleIssue.event[0].exception.values[0].type,
    subtitle: sampleIssue.event[0].exception.values[0].value,
    eventId: sampleIssue.event[0].event_id
  }
});

issueListItem.story = {
  parameters: {
    notes:
      "Oh hey you can leave notes. Why is the alignment so weird though? Not sure if this is a great place to take notes."
  }
};

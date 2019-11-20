import { IssueListItemComponent } from "./issue-list-item.component";
import { sampleEvent } from "./sample-data";
import { MatCardModule } from "@angular/material/card";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";

export default {
  title: "Issues",
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
    title: sampleEvent.event.exception.values[0].type,
    eventId: sampleEvent.event.event_id
  }
});

issueListItem.story = {
  parameters: {
    notes:
      "Oh hey you can leave notes. Why is the alignment so weird though? Not sure if this is a great place to take notes."
  }
};

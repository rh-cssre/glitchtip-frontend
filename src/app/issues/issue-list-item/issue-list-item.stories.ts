import { IssueListItemComponent } from "./issue-list-item.component";
import { sampleEvent } from './sample-data';

export default {
  title: "Issues"
};

export const issueListItem = () => ({
  component: IssueListItemComponent,
  props: {
    eventId: sampleEvent.event_id
  }
});

issueListItem.story = {
  parameters: {
    notes:
      "Oh hey you can leave notes. Why is the alignment so weird though? Not sure if this is a great place to take notes."
  }
};

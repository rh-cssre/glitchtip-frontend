import { sampleEvent } from "./sample-data";
import { MatCardModule } from "@angular/material/card";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs } from "@storybook/addon-knobs";
import { EventDetailComponent } from "./event-detail.component";

export default {
  title: "Issues",
  decorators: [
    moduleMetadata({
      imports: [MatCardModule]
    }),
    withKnobs
  ]
};

export const eventDetail = () => ({
  component: EventDetailComponent,
  props: {
    eventId: sampleEvent.event_id
  }
});


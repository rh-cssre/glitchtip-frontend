import { EventDetailComponent } from "./event-detail.component";
import { IssueEventList } from "./event-by-issue-test-data";
import { signal } from "@angular/core";

export default {
    title: "Events/Event Detail/Event Attributes",
    component: EventDetailComponent,
};

export const EventAttributes = () => {
    return {
        props: {
        orgSlug: signal("test-org"),
        issueID: signal("12345"),
        eventID: signal("test-event-id"),
        event: signal(IssueEventList[0]),
        },
    };
};

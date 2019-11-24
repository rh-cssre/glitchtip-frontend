import { Issue } from "../interfaces";
import { sampleEvent } from "../event-detail/sample-data";

export const sampleIssue: Issue = {
  id: 1,
  title: "title",
  location: "location",
  event: [sampleEvent]
};

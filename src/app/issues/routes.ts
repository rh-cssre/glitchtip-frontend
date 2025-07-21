import { Route } from "@angular/router";
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueDetailComponent } from "./issue-detail/issue-detail.component";
import { CommentsComponent } from "./comments/comments.component";
import { EventDetailComponent } from "./issue-detail/event-detail/event-detail.component";
import { UserReportsIssueComponent } from "./user-reports-issue/user-reports-issue";
import { MergedComponent } from "./merged/merged.component";

export default [
  {
    path: "",
    component: IssuesPageComponent,
  },
  {
    path: ":issue-id",
    component: IssueDetailComponent,
    resolve: [],
    children: [
      { path: "", component: EventDetailComponent },
      { path: "comments", component: CommentsComponent },
      { path: "merged", component: MergedComponent },
      { path: "user-reports", component: UserReportsIssueComponent },
      { path: "events/:event-id", component: EventDetailComponent },
    ],
  },
] as Route[];

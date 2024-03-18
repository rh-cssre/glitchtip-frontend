import { Route } from "@angular/router";
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueDetailComponent } from "./issue-detail/issue-detail.component";
import { CommentsComponent } from "./comments/comments.component";
import { EventDetailComponent } from "./issue-detail/event-detail/event-detail.component";
import { UserReportsIssueComponent } from "./user-reports-issue/user-reports-issue.component";
import { importProvidersFrom } from "@angular/core";
import { MarkdownModule } from "ngx-markdown";

export default [
  {
    path: "",
    component: IssuesPageComponent,
    providers: [importProvidersFrom(MarkdownModule.forRoot({}))],
  },
  {
    path: ":issue-id",
    component: IssueDetailComponent,
    resolve: [],
    children: [
      { path: "", component: EventDetailComponent },
      { path: "comments", component: CommentsComponent },
      { path: "user-reports", component: UserReportsIssueComponent },
      { path: "events/:event-id", component: EventDetailComponent },
    ],
    providers: [importProvidersFrom(MarkdownModule.forRoot({}))],
  },
] as Route[];

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueDetailComponent } from "./issue-detail/issue-detail.component";
import { EventDetailComponent } from "./issue-detail/event-detail/event-detail.component";
import { UserReportsIssueComponent } from "./user-reports-issue/user-reports-issue.component";

const routes: Routes = [
  { path: "", component: IssuesPageComponent },
  {
    path: ":issue-id",
    component: IssueDetailComponent,
    children: [
      { path: "", component: EventDetailComponent },
      { path: "user-reports", component: UserReportsIssueComponent },
      { path: "events/:event-id", component: EventDetailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssuesRoutingModule {}

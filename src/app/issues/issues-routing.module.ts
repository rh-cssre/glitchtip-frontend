import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueDetailComponent } from "./issue-detail/issue-detail.component";
import { EventDetailComponent } from "./issue-detail/event-detail/event-detail.component";

const routes: Routes = [
  { path: "", component: IssuesPageComponent },
  {
    path: ":issue-id",
    component: IssueDetailComponent,
    children: [
      { path: "", component: EventDetailComponent },
      { path: "events/:event-id", component: EventDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuesRoutingModule {}

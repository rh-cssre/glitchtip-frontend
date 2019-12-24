import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueDetailComponent } from "./issue-detail/issue-detail.component";

const routes: Routes = [
  { path: "", component: IssuesPageComponent },
  { path: ":issue-id", component: IssueDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuesRoutingModule {}

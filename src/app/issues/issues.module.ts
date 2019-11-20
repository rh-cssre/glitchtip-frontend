import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { IssuesRoutingModule } from "./issues-routing.module";
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueListItemComponent } from "./issue-list-item/issue-list-item.component";
import { MatCardModule } from "@angular/material/card";

@NgModule({
  declarations: [IssuesPageComponent, IssueListItemComponent],
  imports: [CommonModule, IssuesRoutingModule, MatCardModule]
})
export class IssuesModule {}

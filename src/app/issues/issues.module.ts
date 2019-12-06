import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { IssuesRoutingModule } from "./issues-routing.module";
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueListItemComponent } from "./issue-list-item/issue-list-item.component";
import { EventDetailComponent } from "./event-detail/event-detail.component";

@NgModule({
  declarations: [
    IssuesPageComponent,
    IssueListItemComponent,
    EventDetailComponent
  ],
  imports: [
    CommonModule,
    IssuesRoutingModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class IssuesModule {}

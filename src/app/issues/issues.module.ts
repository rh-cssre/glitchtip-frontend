import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { IssuesRoutingModule } from "./issues-routing.module";
import { MaterialModule } from "../shared/material.module";
import { SharedModule } from "../shared/shared.module";

// Components
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueListItemComponent } from "./issue-list-item/issue-list-item.component";
import { IssueDetailComponent } from "./issue-detail/issue-detail.component";
import { EventDetailComponent } from "./issue-detail/event-detail/event-detail.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IssuesRoutingModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    IssuesPageComponent,
    IssueListItemComponent,
    IssueDetailComponent,
    EventDetailComponent
  ]
})
export class IssuesModule {}

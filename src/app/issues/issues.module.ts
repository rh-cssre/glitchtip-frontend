import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { IssuesRoutingModule } from "./issues-routing.module";

import {
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatCheckboxModule,
  MatButtonModule
} from "@angular/material";

// Components
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueListItemComponent } from "./issue-list-item/issue-list-item.component";
import { EventDetailComponent } from "./event-detail/event-detail.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IssuesRoutingModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  declarations: [
    IssuesPageComponent,
    IssueListItemComponent,
    EventDetailComponent
  ]
})
export class IssuesModule {}

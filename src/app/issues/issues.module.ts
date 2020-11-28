import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { MatBadgeModule } from "@angular/material/badge";
import { MarkdownModule } from "ngx-markdown";

import { IssuesRoutingModule } from "./issues-routing.module";
import { SharedModule } from "../shared/shared.module";
import { LazyMarkdownModule } from "../lazy-markdown/lazy-markdown.module";

// Components
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueListItemComponent } from "./issue-list-item/issue-list-item.component";
import { IssueDetailComponent } from "./issue-detail/issue-detail.component";
import { EventDetailComponent } from "./issue-detail/event-detail/event-detail.component";
import { EntryRequestComponent } from "./issue-detail/event-detail/entry-request/entry-request.component";
import { HeaderNavComponent } from "./header-nav/header-nav.component";
import { EntryCSPComponent } from "./issue-detail/event-detail/entry-csp/entry-csp.component";
import { EntryMessageComponent } from "./issue-detail/event-detail/entry-message/entry-message.component";
import { EntryExceptionComponent } from "./issue-detail/event-detail/entry-exception/entry-exception.component";
import { IssueDetailTitleComponent } from "./issue-detail/issue-detail-title/issue-detail-title.component";
import { FrameTitleComponent } from "./issue-detail/event-detail/entry-exception/frame-title/frame-title.component";
import { FrameExpandedComponent } from "./issue-detail/event-detail/entry-exception/frame-expanded/frame-expanded.component";
import { RawStacktraceComponent } from "./issue-detail/event-detail/entry-exception/raw-stacktrace/raw-stacktrace.component";
import { UserReportsIssueComponent } from "./user-reports-issue/user-reports-issue.component";
import { ContextsComponent } from "./issue-detail/event-detail/context/contexts.component";
import { IssueZeroStatesComponent } from "./issue-zero-states/issue-zero-states.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IssuesRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTableModule,
    MatTabsModule,
    MatBadgeModule,
    MarkdownModule,
    LazyMarkdownModule,
  ],
  declarations: [
    IssuesPageComponent,
    IssueListItemComponent,
    IssueDetailComponent,
    EventDetailComponent,
    EntryRequestComponent,
    EntryCSPComponent,
    EntryMessageComponent,
    HeaderNavComponent,
    EntryExceptionComponent,
    IssueDetailTitleComponent,
    FrameTitleComponent,
    FrameExpandedComponent,
    RawStacktraceComponent,
    UserReportsIssueComponent,
    ContextsComponent,
    IssueZeroStatesComponent,
  ],
})
export class IssuesModule {}

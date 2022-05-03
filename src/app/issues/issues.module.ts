import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatBadgeModule } from "@angular/material/badge";
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from "@angular/material/expansion";
import { MarkdownModule } from "ngx-markdown";

import { IssuesRoutingModule } from "./issues-routing.module";
import { DataFilterBarModule } from "../list-elements/data-filter-bar/data-filter-bar.module";
import { ProjectFilterBarModule } from "../list-elements/project-filter-bar/project-filter-bar.module";
import { LazyMarkdownModule } from "../lazy-markdown/lazy-markdown.module";
import { ListFooterModule } from "../list-elements/list-footer/list-footer.module";
import { ListTitleModule } from "../list-elements/list-title/list-title.module";
import { SharedModule } from "../shared/shared.module";

// Components
import { IssuesPageComponent } from "./issues-page/issues-page.component";
import { IssueDetailComponent } from "./issue-detail/issue-detail.component";
import { EventDetailComponent } from "./issue-detail/event-detail/event-detail.component";
import { EntryRequestComponent } from "./issue-detail/event-detail/entry-request/entry-request.component";
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
import { EntryBreadcrumbsComponent } from "./issue-detail/event-detail/entry-breadcrumbs/entry-breadcrumbs.component";
import { IssueDetailTagsComponent } from "./issue-detail/issue-detail-tags/issue-detail-tags.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IssuesRoutingModule,
    SharedModule,
    MatTableModule,
    MatTabsModule,
    MatBadgeModule,
    MatChipsModule,
    MatExpansionModule,
    MarkdownModule,
    LazyMarkdownModule,
    ListFooterModule,
    ListTitleModule,
    DataFilterBarModule,
    ProjectFilterBarModule,
  ],
  declarations: [
    IssuesPageComponent,
    IssueDetailComponent,
    EventDetailComponent,
    EntryRequestComponent,
    EntryCSPComponent,
    EntryMessageComponent,
    EntryExceptionComponent,
    IssueDetailTitleComponent,
    FrameTitleComponent,
    FrameExpandedComponent,
    RawStacktraceComponent,
    UserReportsIssueComponent,
    ContextsComponent,
    IssueZeroStatesComponent,
    EntryBreadcrumbsComponent,
    IssueDetailTagsComponent,
  ],
})
export class IssuesModule {}

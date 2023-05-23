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
import { LazyMarkdownModule } from "../lazy-markdown/lazy-markdown.module";
import { LessAnnoyingErrorStateMatcherModule } from "../shared/less-annoying-error-state-matcher.module";

import { DataFilterBarComponent } from "../list-elements/data-filter-bar/data-filter-bar.component";
import { ProjectFilterBarComponent } from "../list-elements/project-filter-bar/project-filter-bar.component";
import { ListFooterComponent } from "../list-elements/list-footer/list-footer.component";
import { ListTitleComponent } from "../list-elements/list-title/list-title.component";

// Declared Components
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

import { CommentsComponent } from "./comments/comments.component";
import { CommentFormComponent } from "./comments/comment-form/comment-form.component";
import { CopyInputComponent } from "../shared/copy-input/copy-input.component";
import { DaysAgoPipe, DaysOldPipe } from "../shared/days-ago.pipe";
import { EntryDataComponent } from "../shared/entry-data/entry-data.component";
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    IssuesRoutingModule,
    MatTableModule,
    MatTabsModule,
    MatBadgeModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatInputModule,
    MatButtonModule,
    MarkdownModule,
    LazyMarkdownModule,
    LessAnnoyingErrorStateMatcherModule,
    ListFooterComponent,
    ListTitleComponent,
    DataFilterBarComponent,
    ProjectFilterBarComponent,
    CopyInputComponent,
    DaysAgoPipe,
    DaysOldPipe,
    EntryDataComponent,
    LoadingButtonComponent,
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
    CommentsComponent,
    CommentFormComponent,
],
})
export class IssuesModule {}

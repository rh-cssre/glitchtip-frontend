import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  computed,
  effect,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { IssueDetailService } from "../issue-detail.service";
import { EntryDataComponent } from "../../../shared/entry-data/entry-data.component";
import { EntryRequestComponent } from "./entry-request/entry-request.component";
import { EntryBreadcrumbsComponent } from "./entry-breadcrumbs/entry-breadcrumbs.component";
import { EntryCSPComponent } from "./entry-csp/entry-csp.component";
import { EntryExceptionComponent } from "./entry-exception/entry-exception.component";
import { EntryMessageComponent } from "./entry-message/entry-message.component";
import { ContextsComponent } from "./context/contexts.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe, KeyValuePipe } from "@angular/common";

@Component({
  selector: "gt-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatDividerModule,
    ContextsComponent,
    EntryMessageComponent,
    EntryExceptionComponent,
    EntryCSPComponent,
    EntryBreadcrumbsComponent,
    EntryRequestComponent,
    EntryDataComponent,
    DatePipe,
    KeyValuePipe,
  ],
})
export class EventDetailComponent {
  private issueService = inject(IssueDetailService);
  orgSlug = input.required<string>({ alias: "org-slug" });
  issueID = input.required<string>({ alias: "issue-id" });
  eventID = input<string | null>(null, { alias: "event-id" });
  query = input<string | null>(null);

  event = this.issueService.event;
  contexts = computed(() => this.event()?.contexts as { [key: string]: any });
  initialLoadComplete = this.issueService.eventInitialLoadComplete;
  nextEvent = this.issueService.hasNextEvent;
  previousEvent = this.issueService.hasPreviousEvent;
  nextEventUrl = this.issueService.nextEventUrl;
  previousEventUrl = this.issueService.previousEventUrl;

  constructor() {
    effect(() => {
      this.issueService.eventID.set(this.eventID());
    });
  }

  /** TODO fix these types */
  generateQuery(tag: { [key: string]: string | null }) {
    // Assume unresolved if not present; tag overrides query otherwise
    const unresolved = this.query() === undefined ? "is:unresolved " : "";

    if (tag.key === "environment") {
      return { environment: tag.value };
    } else {
      return { query: `${unresolved}"${tag.key}":"${tag.value}"` };
    }
  }
}

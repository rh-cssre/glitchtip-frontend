import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map, exhaustMap } from "rxjs/operators";
import { IssueDetailService } from "../issue-detail.service";
import { EventTag } from "src/app/issues/interfaces";
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
import { AsyncPipe, JsonPipe, DatePipe, KeyValuePipe } from "@angular/common";

@Component({
  selector: "gt-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
    AsyncPipe,
    JsonPipe,
    DatePipe,
    KeyValuePipe
],
})
export class EventDetailComponent implements OnInit {
  event$ = this.issueService.event$;
  initialLoadComplete$ = this.issueService.eventInitialLoadComplete$;
  nextEvent$ = this.issueService.hasNextEvent$;
  previousEvent$ = this.issueService.hasPreviousEvent$;
  nextEventUrl$ = this.issueService.nextEventUrl$;
  previousEventUrl$ = this.issueService.previousEventUrl$;
  eventIDParam$ = this.route.paramMap.pipe(
    map((params) => params.get("event-id"))
  );
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));

  constructor(
    private issueService: IssueDetailService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.eventIDParam$
      .pipe(
        exhaustMap((eventID) => {
          if (eventID) {
            return this.issueService.getEventByID(eventID);
          }
          return this.issueService.getLatestEvent();
        })
      )
      .subscribe();
  }

  getNewerEvent() {
    this.issueService.getNextEvent();
  }

  getOlderEvent() {
    this.issueService.getPreviousEvent();
  }

  /** TODO fix these types */
  generateQuery(tag: EventTag) {
    // Assume unresolved if not present; tag overrides query otherwise
    const query = this.route.snapshot.queryParams.query;
    const unresolved = query === undefined ? "is:unresolved " : "";

    if (tag.key === "environment") {
      return { environment: tag.value };
    } else {
      return { query: `${unresolved}"${tag.key}":"${tag.value}"` };
    }
  }
}

import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, exhaustMap } from "rxjs/operators";
import { IssueDetailService } from "../issue-detail.service";
import { EventTag } from "src/app/issues/interfaces";

@Component({
  selector: "gt-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

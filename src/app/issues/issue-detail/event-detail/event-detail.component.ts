import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, exhaustMap } from "rxjs/operators";
import { IssueDetailService } from "../issue-detail.service";

@Component({
  selector: "app-event-detail",
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
  generateQuery(key: string | number | null, value: string | number | null) {
    // We want to assume unresolved if not present; query overrides otherwise
    const query = this.route.snapshot.queryParams.query;
    const unresolved = query === undefined ? "is:unresolved " : "";

    if (key === "environment") {
      return { environment: value };
    } else {
      return { query: `${unresolved}"${key}":"${value}"` };
    }
  }
}

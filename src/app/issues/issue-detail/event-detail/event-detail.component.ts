import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, exhaustMap } from "rxjs/operators";
import { IssueDetailService } from "../issue-detail.service";

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.component.html",
  styleUrls: ["./event-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailComponent implements OnInit {
  event$ = this.issueService.event$;
  reversedFrames$ = this.issueService.reversedFrames$;
  nextEvent$ = this.issueService.hasNextEvent$;
  previousEvent$ = this.issueService.hasPreviousEvent$;
  nextEventUrl$ = this.issueService.nextEventUrl$;
  previousEventUrl$ = this.issueService.previousEventUrl$;
  eventIDParam$ = this.route.paramMap.pipe(
    map(params => params.get("event-id"))
  );
  isReversed$ = this.issueService.isReversed$;

  constructor(
    private issueService: IssueDetailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.eventIDParam$
      .pipe(
        exhaustMap(eventID => {
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

  getFlippedFrames() {
    this.issueService.getReversedFrames();
  }
}

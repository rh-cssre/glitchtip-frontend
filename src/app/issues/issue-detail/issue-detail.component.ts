import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, exhaustMap, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { IssueDetailService } from "./issue-detail.service";

@Component({
  selector: "app-issue-detail",
  templateUrl: "./issue-detail.component.html",
  styleUrls: ["./issue-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueDetailComponent implements OnInit {
  issue$ = this.issueService.issue$;
  event$ = this.issueService.event$;
  nextEvent$ = this.issueService.hasNextEvent$;
  previousEvent$ = this.issueService.hasPreviousEvent$;

  constructor(
    private issueService: IssueDetailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(params => params.get("issue-id")),
        tap(() => this.issueService.clearState()),
        exhaustMap(issueId => {
          if (issueId) {
            return this.issueService.retrieveIssue(+issueId);
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  getNextEvent() {
    this.issueService.getNextEvent();
  }

  getPreviousEvent() {
    this.issueService.getPreviousEvent();
  }
}

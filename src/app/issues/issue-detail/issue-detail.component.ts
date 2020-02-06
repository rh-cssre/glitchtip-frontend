import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
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
  form = new FormGroup({
    assignee: new FormControl("")
  });
  displayedColumns: string[] = ["issueNum", "events"];
  issueIdParam$ = this.route.paramMap.pipe(
    map(params => params.get("issue-id"))
  );
  participantCountPluralMapping: { [k: string]: string } = {
    "=0": "No Participants",
    "=1": "1 Participant",
    other: "# Participants"
  };

  constructor(
    private issueService: IssueDetailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.issueIdParam$
      .pipe(
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

  markResolved() {
    this.issueService.setStatus("resolved");
  }

  markUnresolved() {
    this.issueService.setStatus("unresolved");
  }

  markIgnored() {
    this.issueService.setStatus("ignored");
  }
}

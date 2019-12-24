import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "./issue-detail.service";
import { ActivatedRoute } from "@angular/router";
import { map, exhaustMap, tap } from "rxjs/operators";

@Component({
  selector: "app-issue-detail",
  templateUrl: "./issue-detail.component.html",
  styleUrls: ["./issue-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueDetailComponent implements OnInit {
  issue$ = this.issueService.issue$;
  constructor(
    private issueService: IssueDetailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(params => params.get("issue-id")),
        tap(() => this.issueService.clearState()),
        exhaustMap(issueId => this.issueService.retrieveIssue(+issueId))
      )
      .subscribe();
  }
}

import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { IssueDetailService } from "../issue-detail/issue-detail.service";
import { UserReportsService } from "src/app/api/user-reports/user-reports.service";
import { map, tap } from "rxjs/operators";
import { Subscription, combineLatest } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-user-reports-issue",
  templateUrl: "./user-reports-issue.component.html",
  styleUrls: ["./user-reports-issue.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserReportsIssueComponent implements OnDestroy {
  issueId$ = this.issueService.issue$.pipe(map((issue) => issue?.id));
  reports$ = this.userReportService.reports$;
  loadingReports$ = this.userReportService.loadingReports$;
  errorReports$ = this.userReportService.errorsReports$;

  hasNextPage$ = this.userReportService.hasNextPage$;
  hasPreviousPage$ = this.userReportService.hasPreviousPage$;
  nextParams$ = this.userReportService.nextPageParams$;
  previousParams$ = this.userReportService.previousPageParams$;

  routerEventSubscription: Subscription;

  constructor(
    private issueService: IssueDetailService,
    private userReportService: UserReportsService,
    private route: ActivatedRoute
  ) {
    this.routerEventSubscription = combineLatest([
      this.route.queryParams,
      this.issueId$,
    ])
      .pipe(
        map(([queryParams, issueId]) => {
          const cursor: string | undefined = queryParams.cursor;
          return { issueId, cursor };
        }),
        tap(({ issueId, cursor }) => {
          if (issueId) {
            this.userReportService.getReportsForIssue(issueId, cursor);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
  }
}

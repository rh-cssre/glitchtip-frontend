import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { Subscription, combineLatest } from "rxjs";
import { IssueDetailService } from "../issue-detail/issue-detail.service";
import {
  UserReportsState,
  UserReportsService,
} from "src/app/api/user-reports/user-reports.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-stateful-service";

@Component({
  selector: "app-user-reports-issue",
  templateUrl: "./user-reports-issue.component.html",
  styleUrls: ["./user-reports-issue.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserReportsIssueComponent
  extends PaginationBaseComponent<UserReportsState, UserReportsService>
  implements OnDestroy {
  issueId$ = this.issueService.issue$.pipe(map((issue) => issue?.id));
  reports$ = this.userReportService.reports$;
  errorReports$ = this.userReportService.errors$;

  routerEventSubscription: Subscription;

  constructor(
    private issueService: IssueDetailService,
    private userReportService: UserReportsService,
    private route: ActivatedRoute
  ) {
    super(userReportService);
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

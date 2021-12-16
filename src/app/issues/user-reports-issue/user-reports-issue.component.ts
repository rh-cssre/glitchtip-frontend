import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { Subscription, combineLatest } from "rxjs";
import { IssueDetailService } from "../issue-detail/issue-detail.service";
import {
  UserReportsState,
  UserReportsService,
} from "src/app/api/user-reports/user-reports.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";

@Component({
  selector: "gt-user-reports-issue",
  templateUrl: "./user-reports-issue.component.html",
  styleUrls: ["./user-reports-issue.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserReportsIssueComponent
  extends PaginationBaseComponent<UserReportsState, UserReportsService>
  implements OnDestroy
{
  issueId$ = this.issueService.issue$.pipe(map((issue) => issue?.id));
  reports$ = this.userReportService.reports$;
  errorReports$ = this.userReportService.errors$;

  routerEventSubscription: Subscription;

  constructor(
    private issueService: IssueDetailService,
    private userReportService: UserReportsService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(userReportService, router, route);
    this.routerEventSubscription = combineLatest([
      this.cursorNavigationEnd$,
      this.issueId$,
    ])
      .pipe(
        map(([cursor, issueId]) => {
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

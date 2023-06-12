import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { Subscription, combineLatest } from "rxjs";
import { IssueDetailService } from "../issue-detail/issue-detail.service";
import {
  UserReportsState,
  UserReportsService,
} from "src/app/api/user-reports/user-reports.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { NgIf, NgFor, AsyncPipe, DatePipe } from "@angular/common";

@Component({
    selector: "gt-user-reports-issue",
    templateUrl: "./user-reports-issue.component.html",
    styleUrls: ["./user-reports-issue.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatCardModule,
        NgFor,
        MatDividerModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        MatProgressSpinnerModule,
        AsyncPipe,
        DatePipe,
    ],
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

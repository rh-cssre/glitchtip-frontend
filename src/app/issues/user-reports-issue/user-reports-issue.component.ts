import { Component, ChangeDetectionStrategy, OnDestroy, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { IssueDetailService } from "../issue-detail/issue-detail.service";
import { UserReportsService } from "src/app/api/user-reports/user-reports.service";

@Component({
  selector: "gt-user-reports-issue",
  templateUrl: "./user-reports-issue.component.html",
  styleUrls: ["./user-reports-issue.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class UserReportsIssueComponent implements OnDestroy {
  private issueService = inject(IssueDetailService);
  private userReportService = inject(UserReportsService);
  protected route = inject(ActivatedRoute);

  paginator$ = this.userReportService.paginator$;
  issueId$ = this.issueService.issue$.pipe(map((issue) => issue?.id));
  reports$ = this.userReportService.reports$;
  errorReports$ = this.userReportService.errors$;

  constructor() {
    combineLatest([this.route.queryParamMap, this.issueId$]).subscribe(
      ([queryParams, issueId]) => {
        if (issueId) {
          this.userReportService.getReportsForIssue(
            issueId,
            queryParams.get("cursor"),
          );
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.userReportService.clearState();
  }
}

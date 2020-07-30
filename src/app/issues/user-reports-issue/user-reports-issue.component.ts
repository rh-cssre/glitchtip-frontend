import { Component, ChangeDetectionStrategy } from "@angular/core";
import { IssueDetailService } from "../issue-detail/issue-detail.service";
import { UserReportsService } from "src/app/api/user-reports/user-reports.service";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-user-reports-issue",
  templateUrl: "./user-reports-issue.component.html",
  styleUrls: ["./user-reports-issue.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserReportsIssueComponent {
  issueId$ = this.issueService.issue$.pipe(map((issue) => issue?.id));
  reports$ = this.userReportService.reports$;
  loadingReports$ = this.userReportService.loadingReports$;
  errorReports$ = this.userReportService.errorsReports$;

  constructor(
    private issueService: IssueDetailService,
    private userReportService: UserReportsService
  ) {
    this.issueId$
      .pipe(
        tap((issueId) => {
          if (issueId) {
            this.userReportService.getReportsForIssue(issueId);
          }
        })
      )
      .subscribe();
  }
}

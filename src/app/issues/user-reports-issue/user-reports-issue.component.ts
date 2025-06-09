import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  computed,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { combineLatest } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { IssueDetailService } from "../issue-detail/issue-detail.service";
import { UserReportsService } from "src/app/api/user-reports/user-reports.service";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "gt-user-reports-issue",
  templateUrl: "./user-reports-issue.component.html",
  styleUrls: ["./user-reports-issue.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
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

  paginator = toSignal(this.userReportService.paginator$);
  issueID = computed(() => this.issueService.issue()?.id);
  issueID$ = toObservable(this.issueID);
  reports = this.userReportService.reports;
  errorReports = this.userReportService.errors;

  constructor() {
    combineLatest([this.route.queryParamMap, this.issueID$]).subscribe(
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

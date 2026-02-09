import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  effect,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { UserReportsService } from "./user-reports-state";

@Component({
  selector: "gt-user-reports-issue",
  templateUrl: "./user-reports-issue.html",
  styleUrls: ["./user-reports-issue.scss"],
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
  providers: [UserReportsService],
})
export class UserReportsIssueComponent {
  #service = inject(UserReportsService);
  protected route = inject(ActivatedRoute);

  issueID = input.required<string>({ alias: "issue-id" });
  cursor = input("");
  paginator = this.#service.paginator;
  reports = this.#service.reports;
  errorReports = this.#service.errors;
  loading = this.#service.loading;

  constructor() {
    effect(() => this.#service.setParams(this.issueID(), this.cursor()));
  }
}

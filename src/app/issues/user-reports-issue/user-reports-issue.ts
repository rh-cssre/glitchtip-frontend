import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  effect,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UserReportsService } from "./user-reports-state";
import { LoadingOverlayComponent } from "src/app/shared/loading-overlay/loading-overlay.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { DaysAgoPipe } from "src/app/shared/days-ago.pipe";

@Component({
  selector: "gt-user-reports-issue",
  templateUrl: "./user-reports-issue.html",
  styleUrls: ["./user-reports-issue.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    LoadingOverlayComponent,
    EmptyStateComponent,
    PanelComponent,
    ListComponent,
    ListRowComponent,
    DaysAgoPipe,
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

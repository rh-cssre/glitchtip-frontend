import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
  effect,
} from "@angular/core";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatTableModule } from "@angular/material/table";
import { Router, RouterModule } from "@angular/router";
import { PaginationButtons } from "src/app/list-elements/pagination-buttons/pagination-buttons";
import { HumanizeDurationPipe } from "src/app/shared/seconds-or-ms.pipe";
import { DownReason } from "../uptime.interfaces";
import { reasonTextConversions } from "../uptime.utils";
import { MonitorChecksService } from "./monitor-checks-state";
import { components } from "src/app/api/api-schema";
import { DatePipe } from "@angular/common";
type MonitorDetail = components["schemas"]["MonitorDetailSchema"];

@Component({
  selector: "gt-monitor-checks",
  templateUrl: "./monitor-checks.html",
  styleUrls: ["./monitor-checks.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HumanizeDurationPipe,
    DatePipe,
    MatTableModule,
    MatButtonToggleModule,
    RouterModule,
    PaginationButtons,
  ],
  providers: [MonitorChecksService],
})
export class MonitorChecks {
  protected service = inject(MonitorChecksService);
  protected router = inject(Router);

  orgSlug = input.required<string>();
  monitorID = input.required<number>();
  readonly monitor = input.required<MonitorDetail>();
  readonly isChange = input.required<boolean>();
  readonly cursor = input.required<string | undefined>();
  monitorChecks = this.service.monitorChecks;
  paginator = this.service.paginator;
  loading = this.service.loading;
  initialLoadComplete = this.service.initialLoadComplete
  displayedColumns = ["status", "reason", "responseTime", "startCheck"];

  constructor() {
    effect(() => {
      this.service.setParams(
        this.orgSlug(),
        this.monitorID(),
        this.isChange(),
        this.cursor(),
      );
    });
  }

  convertReasonText(reason: DownReason) {
    if (reasonTextConversions[reason]) {
      return reasonTextConversions[reason];
    } else {
      return "Unknown";
    }
  }

  formatDate(startCheck: string) {
    let date = new Date(startCheck);
    return date.toLocaleDateString();
  }

  toggleIsChange() {
    let isChange = this.isChange();
    isChange = !isChange;
    this.router.navigate([], {
      queryParams: {
        cursor: null,
        isChange,
      },
    });
  }
}

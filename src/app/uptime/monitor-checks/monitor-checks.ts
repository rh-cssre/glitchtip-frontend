import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
  computed,
  effect,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { Router, RouterModule } from "@angular/router";
import { ListFooterComponent } from "src/app/list-elements/list-footer/list-footer.component";
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
    ListFooterComponent,
    HumanizeDurationPipe,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    RouterModule,
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
  displayedColumns = computed(() =>
    [
      "status",
      "reason",
      this.isChange() ? undefined : "responseTime",
      "startCheck",
    ].filter((column) => !!column),
  );

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
      queryParamsHandling: "merge",
    });
  }
}

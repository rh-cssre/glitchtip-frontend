import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest } from "rxjs";
import { MonitorDetail, DownReason } from "../uptime.interfaces";
import { reasonTextConversions } from "../uptime.utils";
import { ListFooterComponent } from "src/app/list-elements/list-footer/list-footer.component";
import { CommonModule } from "@angular/common";
import { HumanizeDurationPipe } from "src/app/shared/seconds-or-ms.pipe";
import { MatTableModule } from "@angular/material/table";
import { MonitorChecksService } from "./monitor-checks.service";

@Component({
  standalone: true,
  selector: "gt-monitor-checks",
  templateUrl: "./monitor-checks.component.html",
  styleUrls: ["./monitor-checks.component.scss"],
  imports: [
    CommonModule,
    ListFooterComponent,
    HumanizeDurationPipe,
    MatTableModule,
    RouterModule,
  ],
})
export class MonitorChecksComponent {
  @Input({ required: true }) monitor!: MonitorDetail;
  monitorChecks$ = this.service.monitorChecks$;
  paginator$ = this.service.paginator$;
  displayedColumns: string[] = [
    "status",
    "reason",
    "responseTime",
    "startCheck",
  ];

  constructor(
    protected service: MonitorChecksService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([params, queryParams]) => {
        const orgSlug = params.get("org-slug");
        const monitorId = params.get("monitor-id");
        if (orgSlug && monitorId) {
          this.service.retrieveMonitorChecks(
            orgSlug,
            monitorId,
            queryParams.get("cursor")
          );
        }
      }
    );
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
}

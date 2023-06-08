import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest, merge, take } from "rxjs";
import { MonitorDetail, DownReason } from "../uptime.interfaces";
import { reasonTextConversions } from "../uptime.utils";
import { ListFooterComponent } from "src/app/list-elements/list-footer/list-footer.component";
import { CommonModule } from "@angular/common";
import { HumanizeDurationPipe } from "src/app/shared/seconds-or-ms.pipe";
import { MatTableModule } from "@angular/material/table";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import {
  MonitorChecksService,
  MonitorChecksState,
} from "./monitor-checks.service";

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
export class MonitorChecksComponent extends PaginationBaseComponent<
  MonitorChecksState,
  MonitorChecksService
> {
  displayedColumns: string[] = [
    "status",
    "reason",
    "responseTime",
    "startCheck",
  ];
  @Input({ required: true }) monitor!: MonitorDetail;

  monitorChecks$ = this.service.monitorChecks$;
  initialParams$ = combineLatest([
    this.route.params,
    this.route.queryParams,
  ]).pipe(take(1));

  constructor(
    protected service: MonitorChecksService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(service, router, route);

    merge(this.initialParams$, this.activeCombinedParams$).subscribe(
      ([params, queryParams]) => {
        if (params["org-slug"] && params["monitor-id"]) {
          this.service.retrieveMonitorChecks(
            params["org-slug"],
            params["monitor-id"],
            queryParams.cursor
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

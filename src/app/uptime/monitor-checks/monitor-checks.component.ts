import { Component, OnDestroy, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";
import { PaginationBaseComponent } from "../../shared/stateful-service/pagination-base.component";
import { UptimeService, UptimeState } from "../uptime.service";
import { MonitorDetail, DownReason } from "../uptime.interfaces";

@Component({
  selector: "gt-monitor-checks",
  templateUrl: "./monitor-checks.component.html",
  styleUrls: ["./monitor-checks.component.scss"],
})
export class MonitorChecksComponent
  extends PaginationBaseComponent<UptimeState, UptimeService>
  implements OnDestroy
{
  displayedColumns: string[] = [
    "status",
    "reason",
    "responseTime",
    "startCheck",
  ];
  @Input() monitor?: MonitorDetail;
  monitorChecks$ = this.uptimeService.monitorChecks$;
  loading$ = this.uptimeService.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  routerEventSubscription: Subscription;

  constructor(
    private uptimeService: UptimeService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(uptimeService, router, route);

    this.routerEventSubscription = this.cursorNavigationEnd$.subscribe(
      (cursor) => {
        this.uptimeService.retrieveMonitorChecks(cursor);
      }
    );
  }

  convertReasonText(reason: DownReason) {
    let readable = "";
    switch (reason) {
      case DownReason.UNKNOWN:
        readable = "Unknown";
        break;
      case DownReason.TIMEOUT:
        readable = "Timeout";
        break;
      case DownReason.STATUS:
        readable = "Wrong status code";
        break;
      case DownReason.BODY:
        readable = "Expected response not found";
        break;
      case DownReason.SSL:
        readable = "SSL error";
        break;
      case DownReason.NETWORK:
        readable = "Network error";
    }
    return readable;
  }

  formatDate(startCheck: string) {
    let date = new Date(startCheck);
    return date.toLocaleDateString();
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }
}

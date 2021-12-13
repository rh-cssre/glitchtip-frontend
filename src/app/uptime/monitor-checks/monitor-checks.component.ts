import { Component, OnInit, Input } from "@angular/core";
import { map } from "rxjs/operators";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-stateful-service";
import { UptimeService, UptimeState } from "../uptime.service";
import { MonitorDetail, DownReason } from "../uptime.interfaces";

@Component({
  selector: "gt-monitor-checks",
  templateUrl: "./monitor-checks.component.html",
  styleUrls: ["./monitor-checks.component.scss"],
})
export class MonitorChecksComponent
  extends PaginationBaseComponent<UptimeState, UptimeService>
  implements OnInit
{
  displayedColumns: string[] = ["status", "reason", "responseTime", "startCheck"];
  @Input() monitor?: MonitorDetail;
  monitorChecks$ = this.uptimeService.monitorChecks$;
  loading$ = this.uptimeService.getState$.pipe(
    map((state) => state.pagination.loading)
  );

  constructor(private uptimeService: UptimeService) { 
    super(uptimeService);
  }

  convertReasonText(reason: DownReason){
    let readable = ""
    switch (reason) {
      case DownReason.UNKNOWN:
        readable = "Unknown"
        break
      case DownReason.TIMEOUT:
        readable = "Timeout"
        break
      case DownReason.STATUS:
        readable = "Wrong status code"
        break
      case DownReason.BODY:
        readable = "Expected response not found"
        break
      case DownReason.SSL:
        readable = "SSL error"
        break
      case DownReason.NETWORK:
        readable = "Network error"
    }
    return readable
  }

  formatDate(startCheck: string) {
      let date = new Date(startCheck);
      return date.toLocaleDateString();
    }

  ngOnInit() {
    this.uptimeService.retrieveMonitorChecks();
  }
}

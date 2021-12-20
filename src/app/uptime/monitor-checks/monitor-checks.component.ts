import { Component, Input } from "@angular/core";
import { Paginator } from "src/app/shared/stateful-service/pagination-stateful-service";
import { MonitorDetail, DownReason, MonitorCheck } from "../uptime.interfaces";

@Component({
  selector: "gt-monitor-checks",
  templateUrl: "./monitor-checks.component.html",
  styleUrls: ["./monitor-checks.component.scss"],
})
export class MonitorChecksComponent {
  displayedColumns: string[] = [
    "status",
    "reason",
    "responseTime",
    "startCheck",
  ];
  @Input() monitor?: MonitorDetail;
  @Input() monitorChecks?: MonitorCheck[] | null;
  @Input() loading?: boolean | null;
  @Input() paginator?: Paginator | null;

  constructor() {}

  convertReasonText(reason: DownReason) {
    switch (reason) {
      case DownReason.UNKNOWN:
        return "Unknown";
      case DownReason.TIMEOUT:
        return "Timeout";
      case DownReason.STATUS:
        return "Wrong status code";
      case DownReason.BODY:
        return "Expected response not found";
      case DownReason.SSL:
        return "SSL error";
      case DownReason.NETWORK:
        return "Network error";
      default:
        return "Unknown";
    }
  }

  formatDate(startCheck: string) {
    let date = new Date(startCheck);
    return date.toLocaleDateString();
  }
}

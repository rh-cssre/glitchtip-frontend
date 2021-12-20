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
}

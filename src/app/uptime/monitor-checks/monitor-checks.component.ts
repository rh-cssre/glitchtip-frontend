import { Component, Input } from "@angular/core";
import { Paginator } from "src/app/shared/stateful-service/pagination-stateful-service";
import { MonitorDetail, DownReason, MonitorCheck } from "../uptime.interfaces";
import { reasonTextConversions } from "../uptime.utils";

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

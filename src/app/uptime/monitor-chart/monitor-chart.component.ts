import { Component, Input } from "@angular/core";
import { MonitorCheck } from "../uptime.interfaces";
import { DownReason } from "../uptime.interfaces";

@Component({
  selector: "gt-monitor-chart",
  templateUrl: "./monitor-chart.component.html",
  styleUrls: ["./monitor-chart.component.scss"],
})
export class MonitorChartComponent {
  @Input() data: MonitorCheck[] = [];

  constructor() {}

  get emptyChecks() {
    if (this.data.length < 60) {
      return new Array(60 - this.data.length);
    } else {
      return [];
    }
  }

  convertReasonText(reason: DownReason) {
    switch (reason) {
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
        return "Down";
    }
  }
}

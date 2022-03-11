import { Component, Input } from "@angular/core";
import { MonitorCheck } from "../uptime.interfaces";
import { DownReason } from "../uptime.interfaces";
import { reasonTextConversions } from "../uptime.utils";

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
    if (!reasonTextConversions[reason] || reason === DownReason.UNKNOWN) {
      return "Down";
    } else {
      return reasonTextConversions[reason];
    }
  }
}

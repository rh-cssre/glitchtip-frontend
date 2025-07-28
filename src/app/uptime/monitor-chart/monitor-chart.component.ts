import { Component, input } from "@angular/core";
import { DownReason } from "../uptime.interfaces";
import { reasonTextConversions } from "../uptime.utils";
import { MatTooltipModule } from "@angular/material/tooltip";
import { components } from "src/app/api/api-schema";
import { DatePipe } from "@angular/common";
type MonitorCheck = components["schemas"]["MonitorCheckSchema"];

@Component({
  selector: "gt-monitor-chart",
  templateUrl: "./monitor-chart.component.html",
  styleUrls: ["./monitor-chart.component.scss"],
  imports: [DatePipe, MatTooltipModule],
})
export class MonitorChartComponent {
  readonly data = input<MonitorCheck[]>([]);

  constructor() {}

  get emptyChecks() {
    if (this.data().length < 60) {
      return new Array(60 - this.data().length);
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

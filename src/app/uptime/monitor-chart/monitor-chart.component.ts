import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePipe, MatTooltipModule],
  host: { "[class.stretch]": "stretch()" },
})
export class MonitorChartComponent {
  downText = $localize`Down`;
  readonly data = input<MonitorCheck[]>([]);
  readonly stretch = input(false, { transform: booleanAttribute });

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

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  effect,
} from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { ListTitleComponent } from "src/app/list-elements/list-title/list-title.component";
import { checkForOverflow, stringAttribute } from "src/app/shared/shared.utils";
import { ListFooterComponent } from "src/app/list-elements/list-footer/list-footer.component";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";
import { MonitorListService } from "./monitor-list.service";

@Component({
  selector: "gt-monitor-list",
  templateUrl: "./monitor-list.component.html",
  styleUrls: ["./monitor-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    ListFooterComponent,
    TimeForPipe,
    MonitorChartComponent,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    ListTitleComponent,
  ],
  providers: [MonitorListService],
})
export class MonitorListComponent {
  protected route = inject(ActivatedRoute);
  service = inject(MonitorListService);
  cursor = input(undefined, { transform: stringAttribute });

  tooltipDisabled = false;
  monitors = this.service.monitors;
  paginator = this.service.paginator;
  loading = this.service.loading;
  displayedColumns: string[] = [
    "statusColor",
    "name-and-url",
    "check-chart",
    "status",
  ];

  constructor() {
    effect(() => {
      this.service.cursor.set(this.cursor());
    });
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}

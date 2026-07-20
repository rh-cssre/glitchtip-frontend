import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  effect,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { ListTitleComponent } from "src/app/list-elements/list-title/list-title.component";
import { checkForOverflow, stringAttribute } from "src/app/shared/shared.utils";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";
import { MonitorListService } from "./monitor-list.service";
import { MatCardModule } from "@angular/material/card";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { PaginationButtons } from "src/app/list-elements/pagination-buttons/pagination-buttons";

@Component({
  selector: "gt-monitor-list",
  templateUrl: "./monitor-list.component.html",
  styleUrls: ["./monitor-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    TimeForPipe,
    MonitorChartComponent,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    ListTitleComponent,
    TopAppBar,
    PaginationButtons,
  ],
  providers: [MonitorListService],
})
export class MonitorListComponent {
  protected route = inject(ActivatedRoute);
  protected breakPointObserver = inject(BreakpointObserver);
  service = inject(MonitorListService);
  cursor = input(undefined, { transform: stringAttribute });

  tooltipDisabled = false;
  monitors = this.service.monitors;
  paginator = this.service.paginator;
  loading = this.service.loading;
  allColumns: string[] = ["name", "checkChart", "status"];
  smallScreenColumns: string[] = ["name", "status"];
  displayedColumns = signal(this.allColumns);
  smallBreakpointSignal = toSignal(
    this.breakPointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]),
  );

  constructor() {
    effect(() => {
      this.service.cursor.set(this.cursor());
    });
    effect(() => {
      const breakPointResult = this.smallBreakpointSignal();
      if (breakPointResult?.matches) {
        this.displayedColumns.set(this.smallScreenColumns);
      } else {
        this.displayedColumns.set(this.allColumns);
      }
    });
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}

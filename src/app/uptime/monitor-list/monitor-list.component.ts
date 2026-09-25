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
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectChange } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { ListTitleComponent } from "src/app/list-elements/list-title/list-title.component";
import { checkForOverflow, stringAttribute } from "src/app/shared/shared.utils";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";
import {
  DEFAULT_MONITOR_SORT,
  MonitorListService,
  MonitorSort,
  monitorSorts,
  toMonitorSort,
} from "./monitor-list.service";
import { DataFilterBarComponent } from "src/app/list-elements/data-filter-bar/data-filter-bar.component";
import { MatCardModule } from "@angular/material/card";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { PaginationButtons } from "src/app/list-elements/pagination-buttons/pagination-buttons";
import { LoadingOverlayComponent } from "src/app/shared/loading-overlay/loading-overlay.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";

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
    DataFilterBarComponent,
    TopAppBar,
    PaginationButtons,
    LoadingOverlayComponent,
    EmptyStateComponent,
  ],
  providers: [MonitorListService],
})
export class MonitorListComponent {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected breakPointObserver = inject(BreakpointObserver);
  service = inject(MonitorListService);
  cursor = input(undefined, { transform: stringAttribute });
  sort = input(undefined, { transform: stringAttribute });

  tooltipDisabled = false;
  monitors = this.service.monitors;
  paginator = this.service.paginator;
  loading = this.service.loading;
  initialLoadComplete = this.service.initialLoadComplete;
  allColumns: string[] = ["name", "checkChart", "status"];
  smallScreenColumns: string[] = ["name", "status"];
  displayedColumns = signal(this.allColumns);
  smallBreakpointSignal = toSignal(
    this.breakPointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]),
  );
  sorts = monitorSorts;
  sortForm = new FormGroup({
    sort: new FormControl<MonitorSort>(DEFAULT_MONITOR_SORT),
  });

  constructor() {
    effect(() => {
      this.service.cursor.set(this.cursor());
    });
    effect(() => {
      const sort = toMonitorSort(this.sort());
      this.service.sort.set(sort);
      this.sortForm.setValue({ sort });
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

  sortByChanged(event: MatSelectChange) {
    // Drop the cursor: a page position from the old order means nothing here.
    this.router.navigate([], {
      queryParams: { cursor: null, sort: event.value },
      queryParamsHandling: "merge",
    });
  }
}

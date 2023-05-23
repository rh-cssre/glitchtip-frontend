import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { map, withLatestFrom } from "rxjs/operators";
import { ListTitleComponent } from "src/app/list-elements/list-title/list-title.component";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { UptimeService, UptimeState } from "../uptime.service";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { ListFooterComponent } from "src/app/list-elements/list-footer/list-footer.component";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";

@Component({
  standalone: true,
  selector: "gt-monitor-list",
  templateUrl: "./monitor-list.component.html",
  styleUrls: ["./monitor-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ListFooterComponent,
    TimeForPipe,
    MonitorChartComponent,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    ListTitleComponent,
  ],
})
export class MonitorListComponent extends PaginationBaseComponent<
  UptimeState,
  UptimeService
> {
  tooltipDisabled = false;

  monitors$ = this.service.monitors$;
  loading$ = this.service.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  displayedColumns: string[] = [
    "statusColor",
    "name-and-url",
    "check-chart",
    "status",
  ];
  navigationEnd$ = this.cursorNavigationEnd$.pipe(
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([_, params, queryParams]) => {
      const orgSlug: string | undefined = params["org-slug"];
      const cursor: string | undefined = queryParams.cursor;
      return { orgSlug, cursor };
    })
  );

  constructor(
    protected service: UptimeService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(service, router, route);

    this.activeCombinedParams$.subscribe(([params, queryParams]) => {
      if (params["org-slug"]) {
        this.service.getMonitors(params["org-slug"], queryParams.cursor);
      }
    });
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}

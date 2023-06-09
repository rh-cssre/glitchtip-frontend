import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { ListTitleComponent } from "src/app/list-elements/list-title/list-title.component";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { MonitorListService, MonitorListState } from "./monitor-list.service";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { ListFooterComponent } from "src/app/list-elements/list-footer/list-footer.component";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";

@Component({
  standalone: true,
  selector: "gt-monitor-list",
  templateUrl: "./monitor-list.component.html",
  styleUrls: ["./monitor-list.component.scss"],
  imports: [
    CommonModule,
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
})
export class MonitorListComponent extends PaginationBaseComponent<
  MonitorListState,
  MonitorListService
> {
  tooltipDisabled = false;

  monitors$ = this.service.monitors$;
  displayedColumns: string[] = [
    "statusColor",
    "name-and-url",
    "check-chart",
    "status",
  ];

  constructor(
    protected service: MonitorListService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(service, router, route);
    combineLatest([
      this.route.parent!.paramMap.pipe(map((params) => params.get("org-slug"))),
      this.route.queryParamMap.pipe(map((params) => params.get("cursor"))),
    ]).subscribe(([orgSlug, cursor]) => {
      if (orgSlug) {
        this.service.getMonitors(orgSlug, cursor);
      }
    });
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}

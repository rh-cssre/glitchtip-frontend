import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { ListTitleComponent } from "src/app/list-elements/list-title/list-title.component";
import { checkForOverflow } from "src/app/shared/shared.utils";
import { ListFooterComponent } from "src/app/list-elements/list-footer/list-footer.component";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";
import { MonitorListService } from "./monitor-list.service";
import { combineLatest } from "rxjs";

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
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    ListTitleComponent,
  ],
})
export class MonitorListComponent implements OnDestroy {
  tooltipDisabled = false;
  monitors$ = this.service.monitors$;
  paginator$ = this.service.paginator$;
  displayedColumns: string[] = [
    "statusColor",
    "name-and-url",
    "check-chart",
    "status",
  ];

  constructor(
    protected route: ActivatedRoute,
    public service: MonitorListService
  ) {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([params, queryParams]) => {
        const orgSlug = params.get("org-slug");
        if (orgSlug) {
          this.service.getMonitors(orgSlug, queryParams.get("cursor"));
        }
      }
    );
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }

  ngOnDestroy(): void {
    this.service.clearState();
  }
}

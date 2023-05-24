import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UptimeState, UptimeService } from "../uptime.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { map } from "rxjs/operators";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { CopyInputComponent } from "src/app/shared/copy-input/copy-input.component";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { CommonModule } from "@angular/common";
import { MonitorChecksComponent } from "../monitor-checks/monitor-checks.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MonitorResponseChartComponent } from "../monitor-response-chart/monitor-response-chart.component";
import { HumanizeDurationPipe } from "src/app/shared/seconds-or-ms.pipe";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
  standalone: true,
  selector: "gt-monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MonitorChecksComponent,
    CopyInputComponent,
    MonitorResponseChartComponent,
    HumanizeDurationPipe,
    TimeForPipe,
    MatButtonModule,
    MatDialogModule,
    MonitorChartComponent,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
})
export class MonitorDetailComponent extends PaginationBaseComponent<
  UptimeState,
  UptimeService
> {
  monitor$ = this.service.activeMonitor$;
  monitorChecks$ = this.service.monitorChecks$;
  loading$ = this.service.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  uptimeAlertCount$ = this.service.uptimeAlertCount$;
  alertCountLoading$ = this.service.alertCountLoading$;
  associatedProjectSlug$ = this.service.associatedProjectSlug$;

  activeMonitorRecentChecksSeries$ =
    this.service.activeMonitorRecentChecksSeries$;
  responseChartScale$ = this.service.activeMonitorRecentChecksSeries$.pipe(
    map((series) => {
      let yScaleMax = 20;
      let xScaleMin = new Date();
      xScaleMin.setHours(xScaleMin.getHours() - 1);
      series?.forEach((subseries) => {
        subseries.series.forEach((dataItem) => {
          if (dataItem.value > yScaleMax) {
            yScaleMax = dataItem.value;
          }
          if (dataItem.name < xScaleMin) {
            xScaleMin = dataItem.name;
          }
        });
      });
      return {
        yScaleMax,
        yScaleMin: 0 - yScaleMax / 6,
        xScaleMin,
      };
    })
  );

  alertCountPluralMapping: { [k: string]: string } = {
    "=1": "is 1 uptime alert",
    other: "are # uptime alerts",
  };

  constructor(
    protected service: UptimeService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(service, router, route);

    this.activeCombinedParams$.subscribe(([params, queryParams]) => {
      const orgSlug = params["org-slug"];
      const monitorId = params["monitor-id"];
      if (orgSlug && monitorId) {
        this.service.retrieveMonitorDetails(orgSlug, monitorId);
        this.service.retrieveMonitorChecks(
          orgSlug,
          monitorId,
          queryParams.cursor
        );
      }
    });
  }
}

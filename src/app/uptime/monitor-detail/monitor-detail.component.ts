import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { MonitorState, MonitorService } from "../monitor.service";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
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
import { lastValueFrom } from "rxjs";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";

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
    MonitorChartComponent,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DetailHeaderComponent,
  ],
})
export class MonitorDetailComponent
  extends StatefulBaseComponent<MonitorState, MonitorService>
  implements OnInit
{
  monitor$ = this.service.activeMonitor$;
  uptimeAlertCount$ = this.service.uptimeAlertCount$;
  alertCountLoading$ = this.service.alertCountLoading$;
  associatedProjectSlug$ = this.service.associatedProjectSlug$;

  routeParams$ = this.route.paramMap.pipe(
    map((params) => [params.get("org-slug"), params.get("monitor-id")])
  );

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
    protected service: MonitorService,
    protected route: ActivatedRoute
  ) {
    super(service);
  }
  ngOnInit() {
    lastValueFrom(
      this.routeParams$.pipe(
        tap(([orgSlug, monitorId]) => {
          if (orgSlug && monitorId) {
            this.service.retrieveMonitorDetails(orgSlug, monitorId);
          }
        })
      )
    );
  }

  delete() {
    if (
      window.confirm(
        `Are you sure you want delete this monitor? You will permanently lose all associated uptime data.`
      )
    ) {
      this.service.deleteMonitor();
    }
  }
}

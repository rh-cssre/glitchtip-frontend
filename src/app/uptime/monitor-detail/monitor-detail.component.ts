import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UptimeState, UptimeService } from "../uptime.service";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";

@Component({
  selector: "gt-monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

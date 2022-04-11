import { Component, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { UptimeState, UptimeService } from "../uptime.service";
import { ActivatedRoute, Router } from "@angular/router";
import { map, withLatestFrom } from "rxjs/operators";
import { Subscription } from "rxjs";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";

@Component({
  selector: "gt-monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorDetailComponent
  extends PaginationBaseComponent<UptimeState, UptimeService>
  implements OnDestroy
{
  monitor$ = this.uptimeService.activeMonitor$;
  monitorChecks$ = this.uptimeService.monitorChecks$;
  loading$ = this.uptimeService.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  uptimeAlertCount$ = this.uptimeService.uptimeAlertCount$;
  alertCountLoading$ = this.uptimeService.alertCountLoading$;
  associatedProjectSlug$ = this.uptimeService.associatedProjectSlug$;
  navigationEnd$ = this.cursorNavigationEnd$.pipe(
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([_, params, queryParams]) => {
      const orgSlug: string | undefined = params["org-slug"];
      const monitorId: string | undefined = params["monitor-id"];
      const cursor: string | undefined = queryParams.cursor;
      return { orgSlug, monitorId, cursor };
    })
  );

  activeMonitorRecentChecksSeries$ =
    this.uptimeService.activeMonitorRecentChecksSeries$;
  responseChartScale$ =
    this.uptimeService.activeMonitorRecentChecksSeries$.pipe(
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

  routerEventSubscription: Subscription;

  constructor(
    private uptimeService: UptimeService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(uptimeService, router, route);

    this.routerEventSubscription = this.navigationEnd$.subscribe(
      ({ orgSlug, monitorId, cursor }) => {
        if (orgSlug && monitorId) {
          this.uptimeService.retrieveMonitorDetails(orgSlug, monitorId);
          this.uptimeService.retrieveMonitorChecks(orgSlug, monitorId, cursor);
        }
      }
    );
  }

  ngOnDestroy() {
    this.uptimeService.clearState();
    this.routerEventSubscription.unsubscribe();
  }
}

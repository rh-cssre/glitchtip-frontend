import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";
import { UptimeState, UptimeService } from "../uptime.service";
import { ActivatedRoute, Router } from "@angular/router";
import { tap, map } from "rxjs/operators";
import { combineLatest, Subscription } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";

@Component({
  selector: "gt-monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorDetailComponent
  extends PaginationBaseComponent<UptimeState, UptimeService>
  implements OnInit, OnDestroy
{
  monitor$ = this.uptimeService.activeMonitor$;
  deleteLoading$ = this.uptimeService.deleteLoading$;
  monitorChecks$ = this.uptimeService.monitorChecks$;
  loading$ = this.uptimeService.getState$.pipe(
    map((state) => state.pagination.loading)
  );

  routerEventSubscription: Subscription;

  constructor(
    private organizationsService: OrganizationsService,
    private uptimeService: UptimeService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(uptimeService, router, route);

    this.routerEventSubscription = this.cursorNavigationEnd$.subscribe(
      (cursor) => {
        this.uptimeService.retrieveMonitorChecks(cursor);
      }
    );
  }

  ngOnInit() {
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.route.params,
    ])
      .pipe(
        tap(([orgSlug, params]) => {
          const monitorId = params["monitor-id"];
          if (orgSlug && monitorId) {
            this.uptimeService.retrieveMonitorDetails(orgSlug, monitorId);
          }
        })
      )
      .toPromise();
  }

  ngOnDestroy() {
    this.uptimeService.clearState();
    this.routerEventSubscription.unsubscribe();
  }

  deleteMonitor() {
    if (
      window.confirm(
        `Are you sure you want to remove this monitor? You will lose all of its uptime check history.`
      )
    ) {
      this.uptimeService.deleteMonitor();
    }
  }
}

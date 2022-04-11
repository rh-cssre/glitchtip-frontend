import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, withLatestFrom } from "rxjs/operators";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-base.component";
import { Subscription } from "rxjs";
import { UptimeService, UptimeState } from "../uptime.service";
import { checkForOverflow } from "src/app/shared/shared.utils";

@Component({
  selector: "gt-monitor-list",
  templateUrl: "./monitor-list.component.html",
  styleUrls: ["./monitor-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorListComponent
  extends PaginationBaseComponent<UptimeState, UptimeService>
  implements OnDestroy
{
  tooltipDisabled = false;

  monitors$ = this.uptimeService.monitors$;
  loading$ = this.uptimeService.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  routerEventSubscription: Subscription;
  displayedColumns: string[] = ["statusColor", "name-and-url", "check-chart", "status"];
  navigationEnd$ = this.cursorNavigationEnd$.pipe(
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([_, params, queryParams]) => {
      const orgSlug: string | undefined = params["org-slug"];
      const cursor: string | undefined = queryParams.cursor;
      return { orgSlug, cursor };
    })
  );

  constructor(
    private uptimeService: UptimeService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(uptimeService, router, route);

    this.routerEventSubscription = this.navigationEnd$.subscribe(
      ({ orgSlug, cursor }) => {
        if (orgSlug) {
          this.uptimeService.getMonitors(orgSlug, cursor);
        }
      }
    );
  }

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
    this.uptimeService.clearState();
  }
}

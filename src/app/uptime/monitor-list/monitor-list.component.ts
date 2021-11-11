import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {
  map,
  filter,
  withLatestFrom,
  // distinctUntilChanged,
  // tap,
  // mergeMap,
} from "rxjs/operators";
import { PaginationBaseComponent } from "src/app/shared/stateful-service/pagination-stateful-service";
import { Subscription } from "rxjs";
import { UptimeService, UptimeState } from "../uptime.service";

@Component({
  selector: "gt-monitor-list",
  templateUrl: "./monitor-list.component.html",
  styleUrls: ["./monitor-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorListComponent
extends PaginationBaseComponent<UptimeState, UptimeService>
implements OnDestroy {
  monitors$ = this.uptimeService.monitors$
  loading$ = this.uptimeService.getState$.pipe(
    map((state) => state.pagination.loading)
  );
  routerEventSubscription: Subscription;
  displayedColumns: string[] = ['statusColor', 'name', 'url', 'status'];
  navigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    withLatestFrom(this.route.params, this.route.queryParams),
    map(([event, params, queryParams]) => {
      const orgSlug: string | undefined = params["org-slug"];
      const cursor: string | undefined = queryParams.cursor;
      return { orgSlug, cursor };
    })
  );

  constructor(
    private uptimeService: UptimeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(uptimeService)

    this.routerEventSubscription = this.navigationEnd$.subscribe(
      ({ orgSlug, cursor }) => {
        if (orgSlug) {
          this.uptimeService.getMonitors(
            orgSlug,
            cursor
          );
        }
      }
    );
  }

  ngOnDestroy() {
    this.routerEventSubscription.unsubscribe();
  }
  
}

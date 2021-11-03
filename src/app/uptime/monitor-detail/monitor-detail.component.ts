import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UptimeService } from "../uptime.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { filter, withLatestFrom, map } from "rxjs/operators";


@Component({
  selector: "gt-monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorDetailComponent implements OnInit {
  monitor$ = this.uptimeService.activeMonitor$

  routerEventSubscription: Subscription;
  navigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    withLatestFrom(this.route.params),
    map(([event, params]) => {
      const orgSlug: string | undefined = params["org-slug"];
      const id: string | undefined = params["monitor-id"];
      return { orgSlug, id };
    })
  );

  constructor(
    private uptimeService: UptimeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.uptimeService.activeMonitor$.subscribe()
    this.routerEventSubscription = this.navigationEnd$.subscribe(
      ({ orgSlug, id }) => {
        if (orgSlug) {
          this.uptimeService.retrieveMonitorDetails(
            orgSlug,
            id
          );
        }
      }
    );
  }

  ngOnInit(): void {
  }

}

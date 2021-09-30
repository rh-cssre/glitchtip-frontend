import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {
  map,
  filter,
  withLatestFrom,
  // distinctUntilChanged,
  // tap,
  // mergeMap,
} from "rxjs/operators";
import { Subscription } from "rxjs";
import { UptimeService } from "../uptime.service";

@Component({
  selector: "gt-monitor-list",
  templateUrl: "./monitor-list.component.html",
  styleUrls: ["./monitor-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorListComponent implements OnInit {
  monitors$ = this.uptimeService.monitors$
  routerEventSubscription: Subscription;
  navigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    withLatestFrom(this.route.params),
    map(([event, params]) => {
      const orgSlug: string | undefined = params["org-slug"];
      return { orgSlug };
    })
  );

  constructor(
    private uptimeService: UptimeService,
    private router: Router,
    private route: ActivatedRoute,
  ) { 

    this.uptimeService.monitors$.subscribe()
    this.routerEventSubscription = this.navigationEnd$.subscribe(
      ({ orgSlug }) => {
        if (orgSlug) {
          this.uptimeService.getMonitors(
            orgSlug,
          );
        }
      }
    );
  }

  ngOnInit(): void {
    console.log(this.route.params)
  }
  
}

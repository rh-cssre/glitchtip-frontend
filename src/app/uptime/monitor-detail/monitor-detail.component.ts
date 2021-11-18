import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { UptimeService } from "../uptime.service";
import { ActivatedRoute } from "@angular/router";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";


@Component({
  selector: "gt-monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitorDetailComponent implements OnInit, OnDestroy {
  monitor$ = this.uptimeService.activeMonitor$;
  deleteLoading$ = this.uptimeService.deleteLoading$;
  orgSlug$ = this.route.paramMap.pipe(map((params) => params.get("org-slug")));
  monitorId$ = this.route.paramMap.pipe(map((params) => params.get("monitor-id")))


  constructor(
    private uptimeService: UptimeService,
    private route: ActivatedRoute,
  ) {


  }

  ngOnInit() {
    combineLatest([this.orgSlug$, this.monitorId$])
      .pipe(
        map(([orgSlug, monitorId]) => {
          if (orgSlug && monitorId) {
            this.uptimeService.retrieveMonitorDetails(orgSlug, monitorId)
          }
        })
      )
      .toPromise()
  }

  ngOnDestroy() {
    this.uptimeService.clearState()
  }


  deleteMonitor() {
    if (
      window.confirm(
        `Are you sure you want to remove this monitor? You will lose all of its uptime check history.`
      )
    ) {
      combineLatest([this.orgSlug$, this.monitorId$])
        .pipe(
          map(([orgSlug, monitorId]) => {
            if (orgSlug && monitorId) {
              this.uptimeService.deleteMonitor(orgSlug, monitorId)
            }
          })
        )
        .toPromise()
    }
  }

}

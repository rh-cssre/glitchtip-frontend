import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";
import { UptimeService } from "../uptime.service";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  selector: "gt-monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorDetailComponent implements OnInit, OnDestroy {
  monitor$ = this.uptimeService.activeMonitor$;
  deleteLoading$ = this.uptimeService.deleteLoading$;

  constructor(
    private organizationsService: OrganizationsService,
    private uptimeService: UptimeService,
    private route: ActivatedRoute
  ) {}

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

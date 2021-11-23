import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";
import { UptimeService } from "../uptime.service";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";

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
    private uptimeService: UptimeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        tap((params) => {
          const monitorId = params["monitor-id"];
          if (monitorId) {
            this.uptimeService.retrieveMonitorDetails(monitorId);
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

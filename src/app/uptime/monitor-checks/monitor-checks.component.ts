import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
  EMPTY,
  combineLatest,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs";
import { MonitorDetail, DownReason } from "../uptime.interfaces";
import { reasonTextConversions } from "../uptime.utils";
import { ListFooterComponent } from "src/app/list-elements/list-footer/list-footer.component";
import { CommonModule } from "@angular/common";
import { HumanizeDurationPipe } from "src/app/shared/seconds-or-ms.pipe";
import { MatTableModule } from "@angular/material/table";
import { MonitorChecksService } from "./monitor-checks.service";
import { MatButtonModule } from "@angular/material/button";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  standalone: true,
  selector: "gt-monitor-checks",
  templateUrl: "./monitor-checks.component.html",
  styleUrls: ["./monitor-checks.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ListFooterComponent,
    HumanizeDurationPipe,
    MatTableModule,
    MatButtonModule,
    RouterModule,
  ],
})
export class MonitorChecksComponent {
  @Input({ required: true }) monitor!: MonitorDetail;
  monitorChecks$ = this.service.monitorChecks$;
  isChange$ = this.service.isChange$;
  paginator$ = this.service.paginator$;
  displayedColumns$ = this.isChange$.pipe(
    map((isChanged) =>
      [
        "status",
        "reason",
        isChanged ? undefined : "responseTime",
        "startCheck",
      ].filter((column) => !!column)
    )
  );

  constructor(
    protected service: MonitorChecksService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap,
      this.isChange$.pipe(distinctUntilChanged()),
    ])
      .pipe(
        switchMap(([params, queryParams, isChange]) => {
          console.log("get it", queryParams);
          const orgSlug = params.get("org-slug");
          const monitorId = params.get("monitor-id");
          if (orgSlug && monitorId) {
            return this.service.retrieveMonitorChecks(
              orgSlug,
              monitorId,
              isChange,
              queryParams.get("cursor")
            );
          }
          return EMPTY;
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  convertReasonText(reason: DownReason) {
    if (reasonTextConversions[reason]) {
      return reasonTextConversions[reason];
    } else {
      return "Unknown";
    }
  }

  formatDate(startCheck: string) {
    let date = new Date(startCheck);
    return date.toLocaleDateString();
  }

  toggleIsChange() {
    this.router.navigate([], {
      queryParams: {
        cursor: null,
      },
      queryParamsHandling: "merge",
    });
    this.service.toggleIsChange();
  }
}

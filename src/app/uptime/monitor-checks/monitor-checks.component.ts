import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { combineLatest, distinctUntilChanged, map } from "rxjs";
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
      .pipe(takeUntilDestroyed())
      .subscribe(([params, queryParams, isChange]) => {
        const orgSlug = params.get("org-slug");
        const monitorId = params.get("monitor-id");
        if (orgSlug && monitorId) {
          this.service.retrieveMonitorChecks(
            orgSlug,
            monitorId,
            isChange,
            queryParams.get("cursor")
          );
        }
      });
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
    this.service.toggleIsChange();
    this.router.navigate([], {
      queryParams: {
        cursor: null,
      },
      queryParamsHandling: "merge",
    });
  }
}

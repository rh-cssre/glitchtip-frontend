import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
  EMPTY,
  combineLatest,
  map,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs";
import { ListFooterComponent } from "src/app/list-elements/list-footer/list-footer.component";
import { HumanizeDurationPipe } from "src/app/shared/seconds-or-ms.pipe";
import { DownReason, MonitorDetail } from "../uptime.interfaces";
import { reasonTextConversions } from "../uptime.utils";
import { MonitorChecksService } from "./monitor-checks.service";

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
export class MonitorChecksComponent implements OnDestroy {
  @Input({ required: true }) monitor!: MonitorDetail;
  monitorChecks$ = this.service.monitorChecks$;
  isChange$ = this.route.queryParamMap.pipe(
    map((params) => (params.get("isChange") === "false" ? false : true))
  );
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
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        withLatestFrom(this.isChange$),
        switchMap(([[params, queryParams], isChange]) => {
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
    this.isChange$.pipe(take(1)).subscribe((isChange) => {
      isChange = !isChange;
      this.router.navigate([], {
        queryParams: {
          cursor: null,
          isChange,
        },
        queryParamsHandling: "merge",
      });
    });
  }

  ngOnDestroy(): void {
    this.service.clearState();
  }
}

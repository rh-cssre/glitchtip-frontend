import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  computed,
  input,
  booleanAttribute,
  signal,
  effect,
} from "@angular/core";
import { MonitorState, MonitorService } from "../monitor.service";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { CopyInputComponent } from "src/app/shared/copy-input/copy-input.component";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MonitorChecks } from "../monitor-checks/monitor-checks";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MonitorResponseChart } from "../monitor-response-chart/monitor-response-chart";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { DecimalPipe } from "@angular/common";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { OrganizationsService } from "src/app/api/organizations.service";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { alertName } from "src/app/settings/projects/project-detail/project-alerts/alert-labels";
import { AlertRecipientsComponent } from "src/app/settings/projects/project-detail/project-alerts/alert-recipients/alert-recipients.component";
import { AlertSummaryComponent } from "src/app/settings/projects/project-detail/project-alerts/alert-summary/alert-summary.component";
import { map } from "rxjs";

function booleanDefaultTrueAttribute(value: unknown): boolean {
  return value === undefined ? true : booleanAttribute(value);
}

@Component({
  selector: "gt-monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MonitorChecks,
    CopyInputComponent,
    MonitorResponseChart,
    TimeForPipe,
    DecimalPipe,
    MatButtonModule,
    MonitorChartComponent,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    PageHeaderComponent,
    EmptyStateComponent,
    MatTabsModule,
    MatFormFieldModule,
    TopAppBar,
    BackLinkComponent,
    ListComponent,
    ListRowComponent,
    AlertRecipientsComponent,
    AlertSummaryComponent,
  ],
})
export class MonitorDetailComponent
  extends StatefulComponent<MonitorState, MonitorService>
  implements OnInit
{
  uptimeMonitorsText = $localize`Uptime Monitors`;
  viewAllMonitorsText = $localize`View all uptime monitors`;
  protected service: MonitorService;
  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(MatDialog);
  private organizationsService = inject(OrganizationsService);

  orgSlug = input.required<string>({ alias: "org-slug" });
  monitorID = input.required<number>({ alias: "monitor-id" });
  isChange = input.required({ transform: booleanDefaultTrueAttribute });
  cursor = input<string | undefined>();

  monitor = this.service.activeMonitor;
  readonly tab = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map((params): "overview" | "checks" | "alerts" => {
        const tab = params.get("tab");
        if (tab === "overview" || tab === "checks" || tab === "alerts") {
          return tab;
        }
        return params.has("cursor") || params.has("isChange")
          ? "checks"
          : "overview";
      }),
    ),
    { initialValue: "overview" },
  );

  statusLabel = computed(() => {
    const isUp = this.monitor()?.isUp;
    if (isUp === true) return $localize`Up`;
    if (isUp === false) return $localize`Down`;
    return $localize`No data`;
  });
  statusColor = computed(() => {
    const isUp = this.monitor()?.isUp;
    if (isUp === true) return "var(--gt-monitor-up, var(--success-color))";
    if (isUp === false) return "var(--gt-monitor-down, var(--mat-sys-error))";
    return "var(--gt-monitor-none, var(--mat-sys-outline))";
  });
  intervalLabel = computed(() => {
    const seconds = this.monitor()?.interval ?? 0;
    if (seconds < 120) return $localize`every ${seconds}:count:s`;
    if (seconds < 7200) {
      return $localize`every ${Math.round(seconds / 60)}:count: min`;
    }
    return $localize`every ${Math.round(seconds / 3600)}:count: h`;
  });
  uptimePercent = computed(() => {
    const checks = this.monitor()?.checks ?? [];
    if (!checks.length) return null;
    return (checks.filter((c) => c.isUp).length / checks.length) * 100;
  });
  avgResponseMs = computed(() => {
    const times = (this.monitor()?.checks ?? [])
      .map((c) => c.responseTime)
      .filter((t): t is number => typeof t === "number");
    if (!times.length) return null;
    return times.reduce((sum, t) => sum + t, 0) / times.length;
  });
  monitorAlerts = this.service.monitorAlerts;
  uptimeAlertCount = this.service.uptimeAlertCount;
  alertName = alertName;
  alertCountLoading = this.service.alertCountLoading;
  alertsError = this.service.alertsError;
  associatedProjectSlug = this.service.associatedProjectSlug;
  canWriteProject = this.organizationsService.canWriteProject;
  noProjectMessage = computed(() =>
    this.canWriteProject()
      ? $localize`Associate a project with this monitor to get alerts.`
      : $localize`This monitor has no associated project, so it sends no alerts.`,
  );

  isMobile = signal(false);
  private smallBreakpointSignal = toSignal(
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]),
  );

  activeMonitorRecentChecksSeries =
    this.service.activeMonitorRecentChecksSeries;
  responseChartScale = computed(() => {
    const series = this.service.activeMonitorRecentChecksSeries();
    let yScaleMax = 20;
    let xScaleMin = new Date();
    xScaleMin.setHours(xScaleMin.getHours() - 1);

    series?.forEach((subseries) => {
      subseries.series.forEach((dataItem) => {
        if (dataItem.value > yScaleMax) {
          yScaleMax = dataItem.value;
        }
        if (dataItem.name < xScaleMin) {
          xScaleMin = dataItem.name;
        }
      });
    });

    return {
      yScaleMax,
      yScaleMin: 0 - yScaleMax / 6,
      xScaleMin,
    };
  });

  constructor() {
    const service = inject(MonitorService);
    super(service);
    this.service = service;

    effect(() => {
      const breakpointResult = this.smallBreakpointSignal();
      if (breakpointResult?.matches) {
        this.isMobile.set(true);
      } else {
        this.isMobile.set(false);
      }
    });
  }

  ngOnInit() {
    this.service.retrieveMonitorDetails(this.monitorID());
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete ${this.monitor()?.name ?? ""}?`,
        message: $localize`Its check history is deleted too. This cannot be undone.`,
        confirmText: $localize`Delete`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.deleteMonitor();
      }
    });
  }
}

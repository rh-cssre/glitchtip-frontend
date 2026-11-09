import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  computed,
  input,
  booleanAttribute,
} from "@angular/core";
import { MonitorState, MonitorService } from "../monitor.service";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { CopyInputComponent } from "src/app/shared/copy-input/copy-input.component";
import { MonitorChecks } from "../monitor-checks/monitor-checks";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MonitorResponseChart } from "../monitor-response-chart/monitor-response-chart";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { RecordBandComponent } from "src/app/shared/record-band/record-band.component";
import { MatTabsModule } from "@angular/material/tabs";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { DecimalPipe, NgTemplateOutlet } from "@angular/common";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { OrganizationsService } from "src/app/api/organizations.service";
import { AlertListComponent } from "src/app/settings/projects/project-detail/project-alerts/alert-list/alert-list.component";
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
    NgTemplateOutlet,
    RouterModule,
    MonitorChecks,
    CopyInputComponent,
    MonitorResponseChart,
    TimeForPipe,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MonitorChartComponent,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    PanelComponent,
    RecordBandComponent,
    EmptyStateComponent,
    MatTabsModule,
    FormErrorComponent,
    TopAppBar,
    BackLinkComponent,
    AlertListComponent,
  ],
})
export class MonitorDetailComponent
  extends StatefulComponent<MonitorState, MonitorService>
  implements OnInit
{
  uptimeMonitorsText = $localize`Uptime Monitors`;
  protected service: MonitorService;
  private organizationsService = inject(OrganizationsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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
  uptimeTip = computed(() => {
    const count = this.monitor()?.checks.length ?? 0;
    return count === 1
      ? $localize`Over the last check`
      : $localize`Over the last ${count}:count: checks`;
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
  alertCountLoading = this.service.alertCountLoading;
  alertsError = this.service.alertsError;
  associatedProjectSlug = this.service.associatedProjectSlug;
  // Hide the count until the project's alerts load, so it never flashes 0.
  alertCountKnown = computed(
    () =>
      !this.alertCountLoading() &&
      (!this.monitor()?.projectName || !!this.associatedProjectSlug()),
  );
  canWriteProject = this.organizationsService.canWriteProject;
  noProjectMessage = computed(() =>
    this.canWriteProject()
      ? $localize`Associate a project with this monitor to get alerts.`
      : $localize`This monitor has no associated project, so it sends no alerts.`,
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
  }

  ngOnInit() {
    this.service.retrieveMonitorDetails(this.monitorID());
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete monitor?`,
        message: $localize`Are you sure you want to delete this monitor? You will permanently lose all associated uptime data.`,
        confirmText: $localize`Delete`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.deleteMonitor().then((deleted) => {
          if (!deleted) this.snackBar.open(this.service.deleteError());
        });
      }
    });
  }
}

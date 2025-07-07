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
import { RouterModule } from "@angular/router";
import { CopyInputComponent } from "src/app/shared/copy-input/copy-input.component";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MonitorChecks } from "../monitor-checks/monitor-checks";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MonitorResponseChartComponent } from "../monitor-response-chart/monitor-response-chart.component";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";
import { TimeForPipe } from "src/app/shared/days-ago.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { DecimalPipe, I18nPluralPipe } from "@angular/common";

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
    MonitorResponseChartComponent,
    I18nPluralPipe,
    TimeForPipe,
    DecimalPipe,
    MatButtonModule,
    MonitorChartComponent,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DetailHeaderComponent,
  ],
})
export class MonitorDetailComponent
  extends StatefulComponent<MonitorState, MonitorService>
  implements OnInit
{
  protected service: MonitorService;

  orgSlug = input.required<string>({ alias: "org-slug" });
  monitorID = input.required<number>({ alias: "monitor-id" });
  isChange = input.required({ transform: booleanDefaultTrueAttribute });
  cursor = input<string | undefined>();

  monitor = this.service.activeMonitor;
  uptimeAlertCount = this.service.uptimeAlertCount;
  alertCountLoading = this.service.alertCountLoading;
  associatedProjectSlug = this.service.associatedProjectSlug;

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

  alertCountPluralMapping: { [k: string]: string } = {
    "=1": "is 1 uptime alert",
    other: "are # uptime alerts",
  };

  constructor() {
    const service = inject(MonitorService);
    super(service);
    this.service = service;
  }

  ngOnInit() {
    this.service.retrieveMonitorDetails(this.monitorID());
  }

  delete() {
    if (
      window.confirm(
        `Are you sure you want delete this monitor? You will permanently lose all associated uptime data.`,
      )
    ) {
      this.service.deleteMonitor();
    }
  }
}

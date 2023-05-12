import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { NgxChartsModule } from "@swimlane/ngx-charts";

import { ListFooterModule } from "../list-elements/list-footer/list-footer.module";
import { ListTitleModule } from "../list-elements/list-title/list-title.module";
import { MonitorChartComponent } from "./monitor-chart/monitor-chart.component";
import { MonitorChecksComponent } from "./monitor-checks/monitor-checks.component";
import { MonitorDetailComponent } from "./monitor-detail/monitor-detail.component";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import { MonitorResponseChartComponent } from "./monitor-response-chart/monitor-response-chart.component";
import { MonitorUpdateComponent } from "./monitor-update/monitor-update.component";
import { NewMonitorComponent } from "./new-monitor/new-monitor.component";
import { UptimeRoutingModule } from "./uptime-routing.module";
import { CopyInputComponent } from "../shared/copy-input/copy-input.component";
import { TimeForPipe } from "../shared/days-ago.pipe";
import { HumanizeDurationPipe } from "../shared/seconds-or-ms.pipe";
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    MonitorListComponent,
    NewMonitorComponent,
    MonitorDetailComponent,
    MonitorUpdateComponent,
    MonitorChecksComponent,
    MonitorChartComponent,
    MonitorResponseChartComponent,
  ],
  imports: [
    CommonModule,
    UptimeRoutingModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NgxChartsModule,
    ListFooterModule,
    ListTitleModule,
    CopyInputComponent,
    TimeForPipe,
    HumanizeDurationPipe,
    LoadingButtonComponent,
  ],
})
export class UptimeModule {}

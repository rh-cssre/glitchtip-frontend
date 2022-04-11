import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MonitorChartComponent } from './monitor-chart/monitor-chart.component';
import { MonitorChecksComponent } from "./monitor-checks/monitor-checks.component";
import { MonitorDetailComponent } from "./monitor-detail/monitor-detail.component";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import { MonitorResponseChartComponent } from './monitor-response-chart/monitor-response-chart.component';
import { MonitorUpdateComponent } from "./monitor-update/monitor-update.component";
import { NewMonitorComponent } from "./new-monitor/new-monitor.component";
import { MaterialModule } from "../shared/material.module";
import { SharedModule } from "../shared/shared.module";
import { UptimeRoutingModule } from "./uptime-routing.module";

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
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxChartsModule,
  ],
})
export class UptimeModule {}

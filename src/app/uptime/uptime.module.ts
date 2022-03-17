import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UptimeRoutingModule } from "./uptime-routing.module";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MaterialModule } from "../shared/material.module";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from "../shared/shared.module";
import { NewMonitorComponent } from "./new-monitor/new-monitor.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MonitorDetailComponent } from "./monitor-detail/monitor-detail.component";
import { MonitorUpdateComponent } from "./monitor-update/monitor-update.component";
import { MonitorChecksComponent } from "./monitor-checks/monitor-checks.component";
import { MonitorChartComponent } from './monitor-chart/monitor-chart.component';
import { MonitorResponseChartComponent } from './monitor-response-chart/monitor-response-chart.component';

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

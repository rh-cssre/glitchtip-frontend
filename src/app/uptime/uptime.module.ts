import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UptimeRoutingModule } from "./uptime-routing.module";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import {MatTableModule} from "@angular/material/table";
import { MaterialModule } from "../shared/material.module";
import { SharedModule } from "../shared/shared.module";
import { NewMonitorComponent } from "./new-monitor/new-monitor.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MonitorDetailComponent } from "./monitor-detail/monitor-detail.component";
import { MonitorUpdateComponent } from "./monitor-update/monitor-update.component";
import { MonitorChecksComponent } from './monitor-checks/monitor-checks.component';


@NgModule({
  declarations: [
    MonitorListComponent,
    NewMonitorComponent,
    MonitorDetailComponent,
    MonitorUpdateComponent,
    MonitorChecksComponent
  ],
  imports: [
    CommonModule,
    UptimeRoutingModule,
    MatTableModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UptimeModule { }

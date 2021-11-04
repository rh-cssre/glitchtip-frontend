import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { UptimeRoutingModule } from "./uptime-routing.module";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import {MatTableModule} from "@angular/material/table";
import { MaterialModule } from "../shared/material.module";
import { SharedModule } from "../shared/shared.module";
import { NewMonitorComponent } from "./new-monitor/new-monitor.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MonitorDetailComponent } from "./monitor-detail/monitor-detail.component";


@NgModule({
  declarations: [
    MonitorListComponent,
    NewMonitorComponent,
    MonitorDetailComponent
  ],
  imports: [
    CommonModule,
    UptimeRoutingModule,
    MatTableModule,
    MaterialModule,
    SharedModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UptimeModule { }

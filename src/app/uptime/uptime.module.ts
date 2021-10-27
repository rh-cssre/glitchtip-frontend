import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UptimeRoutingModule } from "./uptime-routing.module";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import {MatTableModule} from "@angular/material/table";
import { MaterialModule } from "../shared/material.module";
import { SharedModule } from "../shared/shared.module";
import { NewMonitorComponent } from "./new-monitor/new-monitor.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    MonitorListComponent,
    NewMonitorComponent
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

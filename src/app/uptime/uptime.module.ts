import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UptimeRoutingModule } from "./uptime-routing.module";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [
    MonitorListComponent
  ],
  imports: [
    CommonModule,
    UptimeRoutingModule,
    MatTableModule
  ]
})
export class UptimeModule { }

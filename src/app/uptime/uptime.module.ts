import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UptimeRoutingModule } from "./uptime-routing.module";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";


@NgModule({
  declarations: [
    MonitorListComponent
  ],
  imports: [
    CommonModule,
    UptimeRoutingModule
  ]
})
export class UptimeModule { }

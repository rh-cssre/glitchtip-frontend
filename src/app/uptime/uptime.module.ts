import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UptimeRoutingModule } from "./uptime-routing.module";
import { MonitorListComponent } from "./monitor-list/monitor-list.component";
import {MatTableModule} from '@angular/material/table';
import { MaterialModule } from "../shared/material.module";
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    MonitorListComponent
  ],
  imports: [
    CommonModule,
    UptimeRoutingModule,
    MatTableModule,
    MaterialModule,
    SharedModule
  ]
})
export class UptimeModule { }

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PerformanceRoutingModule } from "./performance-routing.module";
import { PerformanceComponent } from "./performance.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [PerformanceComponent],
  imports: [SharedModule, CommonModule, PerformanceRoutingModule],
})
export class PerformanceModule {}

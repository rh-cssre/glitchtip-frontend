import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";

import { DataFilterBarModule } from "../list-elements/data-filter-bar/data-filter-bar.module";
import { ListTitleModule } from "../list-elements/list-title/list-title.module";
import { ListFooterModule } from "../list-elements/list-footer/list-footer.module";
import { PerformanceRoutingModule } from "./performance-routing.module";
import { ProjectFilterBarModule } from "../list-elements/project-filter-bar/project-filter-bar.module";
import { TransactionGroupsComponent } from "./transaction-groups/transaction-groups.component";
import { TransactionGroupDetailComponent } from "./transaction-group-detail/transaction-group-detail.component";
import { HumanizeDurationPipe } from "../shared/seconds-or-ms.pipe";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  declarations: [TransactionGroupsComponent, TransactionGroupDetailComponent],
  imports: [
    CommonModule,
    PerformanceRoutingModule,
    MatTableModule,
    ListTitleModule,
    ProjectFilterBarModule,
    DataFilterBarModule,
    ListFooterModule,
    HumanizeDurationPipe,
    MaterialModule,
  ],
})
export class PerformanceModule {}

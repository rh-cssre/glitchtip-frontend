import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";

import { DataFilterBarModule } from "../list-elements/data-filter-bar/data-filter-bar.module";
import { ListTitleModule } from "../list-elements/list-title/list-title.module";
import { PerformanceRoutingModule } from "./performance-routing.module";
import { PerformanceComponent } from "./performance.component";
import { ProjectFilterBarModule } from "../list-elements/project-filter-bar/project-filter-bar.module";
import { SharedModule } from "../shared/shared.module";
import { TransactionDetailComponent } from "./transaction-detail/transaction-detail.component";
import { TransactionGroupsComponent } from './transaction-groups/transaction-groups.component';

@NgModule({
  declarations: [PerformanceComponent, TransactionDetailComponent, TransactionGroupsComponent],
  imports: [
    SharedModule,
    CommonModule,
    PerformanceRoutingModule,
    MatTableModule,
    ListTitleModule,
    ProjectFilterBarModule,
    DataFilterBarModule
  ],
})
export class PerformanceModule {}

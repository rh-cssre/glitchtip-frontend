import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";

import { DataFilterBarModule } from "../list-elements/data-filter-bar/data-filter-bar.module";
import { ListTitleModule } from "../list-elements/list-title/list-title.module";
import { ListFooterModule } from "../list-elements/list-footer/list-footer.module";
import { PerformanceRoutingModule } from "./performance-routing.module";
import { ProjectFilterBarModule } from "../list-elements/project-filter-bar/project-filter-bar.module";
import { SharedModule } from "../shared/shared.module";
import { TransactionGroupsComponent } from './transaction-groups/transaction-groups.component';
import { TransactionGroupDetailComponent } from './transaction-group-detail/transaction-group-detail.component';

@NgModule({
  declarations: [TransactionGroupsComponent, TransactionGroupDetailComponent],
  imports: [
    SharedModule,
    CommonModule,
    PerformanceRoutingModule,
    MatTableModule,
    ListTitleModule,
    ProjectFilterBarModule,
    DataFilterBarModule,
    ListFooterModule
  ],
})
export class PerformanceModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";

import { DataFilterBarComponent } from "../list-elements/data-filter-bar/data-filter-bar.component";
import { ListFooterComponent } from "../list-elements/list-footer/list-footer.component";
import { ListTitleComponent } from "../list-elements/list-title/list-title.component";
import { PerformanceRoutingModule } from "./performance-routing.module";
import { ProjectFilterBarComponent } from "../list-elements/project-filter-bar/project-filter-bar.component";
import { LessAnnoyingErrorStateMatcherModule } from "../shared/less-annoying-error-state-matcher.module";
import { TransactionGroupsComponent } from "./transaction-groups/transaction-groups.component";
import { TransactionGroupDetailComponent } from "./transaction-group-detail/transaction-group-detail.component";
import { HumanizeDurationPipe } from "../shared/seconds-or-ms.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [TransactionGroupsComponent, TransactionGroupDetailComponent],
  imports: [
    CommonModule,
    PerformanceRoutingModule,
    MatTableModule,
    ListTitleComponent,
    ProjectFilterBarComponent,
    DataFilterBarComponent,
    ListFooterComponent,
    LessAnnoyingErrorStateMatcherModule,
    HumanizeDurationPipe,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class PerformanceModule {}

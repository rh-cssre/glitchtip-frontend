import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PerformanceComponent } from "./performance.component";
import { TransactionDetailComponent } from "./transaction-detail/transaction-detail.component";
import { TransactionGroupsComponent } from "./transaction-groups/transaction-groups.component";

const routes: Routes = [
  {
    path: "transaction-groups",
    component: TransactionGroupsComponent,
  },
  {
    path: "",
    component: PerformanceComponent,
  },
  {
    path: ":event-id",
    component: TransactionDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceRoutingModule {}

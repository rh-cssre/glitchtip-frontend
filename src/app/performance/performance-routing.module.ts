import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TransactionGroupDetailComponent } from "./transaction-group-detail/transaction-group-detail.component";
import { TransactionGroupsComponent } from "./transaction-groups/transaction-groups.component";

const routes: Routes = [
  {
    path: "transaction-groups",
    component: TransactionGroupsComponent,
  },
  {
    path: "transaction-groups/:transaction-group-id",
    component: TransactionGroupDetailComponent,
  },
  {
    path: "",
    redirectTo: "transaction-groups",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceRoutingModule {}

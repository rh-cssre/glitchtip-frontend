import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PerformanceComponent } from "./performance.component";
import { TransactionDetailComponent } from "./transaction-detail/transaction-detail.component";

const routes: Routes = [
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

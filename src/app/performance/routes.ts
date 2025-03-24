import { Route } from "@angular/router";
import { TransactionGroupDetailComponent } from "./transaction-group-detail/transaction-group-detail.component";
import { TransactionGroupsComponent } from "./transaction-groups/transaction-groups.component";

export default [
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
] as Route[];

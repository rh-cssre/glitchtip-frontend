import { Route } from "@angular/router";
import { TransactionGroupDetail } from "./transaction-group-detail/transaction-group-detail";
import { TransactionGroups } from "./transaction-groups/transaction-groups";

export default [
  {
    path: "transaction-groups",
    component: TransactionGroups,
  },
  {
    path: "transaction-groups/:transaction-group-id",
    component: TransactionGroupDetail,
  },
  {
    path: "",
    redirectTo: "transaction-groups",
    pathMatch: "full",
  },
] as Route[];

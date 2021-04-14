import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Transaction } from "../api/transactions/transactions.interfaces";
import { TransactionsService } from "../api/transactions/transactions.service";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";

export interface PerformanceState extends PaginationStatefulServiceState {
  transactions: Transaction[];
}

const initialState: PerformanceState = {
  transactions: [],
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class PerformanceService extends PaginationStatefulService<PerformanceState> {
  transactions$ = this.getState$.pipe(map((state) => state.transactions));
  transactionsWithDelta$ = this.transactions$.pipe(
    map((transactions) =>
      transactions.map((transaction) => ({
        ...transaction,
        delta:
          new Date(transaction.timestamp).getTime() -
          new Date(transaction.startTimestamp).getTime(),
      }))
    )
  );

  constructor(private transactionsService: TransactionsService) {
    super(initialState);
  }

  getTransactions(orgSlug: string, cursor?: string | undefined) {
    this.transactionsService
      .list(orgSlug, cursor)
      .pipe(
        tap((res) =>
          this.setStateAndPagination({ transactions: res.body! }, res)
        )
      )
      .toPromise();
  }
}

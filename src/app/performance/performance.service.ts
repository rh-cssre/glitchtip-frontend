import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, lastValueFrom } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { TransactionGroupsService } from "../api/transactions/transaction-groups.service";
import {
  Transaction,
  TransactionGroup,
} from "../api/transactions/transactions.interfaces";
import { TransactionsService } from "../api/transactions/transactions.service";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";

export interface PerformanceState extends PaginationStatefulServiceState {
  transactions: Transaction[];
  transactionGroups: TransactionGroup[];
  errors: string[];
}

const initialState: PerformanceState = {
  transactions: [],
  transactionGroups: [],
  errors: [],
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class PerformanceService extends PaginationStatefulService<PerformanceState> {
  transactions$ = this.getState$.pipe(map((state) => state.transactions));
  transactionGroups$ = this.getState$.pipe(
    map((state) => state.transactionGroups)
  );
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

  constructor(
    private transactionsService: TransactionsService,
    private transactionGroupsService: TransactionGroupsService
  ) {
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

  getTransactionGroups(
    orgSlug: string,
    cursor: string | undefined,
    project: string[] | null,
    start: string | undefined,
    end: string | undefined,
    sort: string | undefined
  ) {
    lastValueFrom(
      this.retrieveTransactionGroups(orgSlug, cursor, project, start, end, sort)
    );
  }

  private retrieveTransactionGroups(
    orgSlug: string,
    cursor?: string,
    project?: string[] | null,
    start?: string,
    end?: string,
    sort?: string
  ) {
    return this.transactionGroupsService
      .list(orgSlug, cursor, project, start, end, sort)
      .pipe(
        tap((res) => {
          this.setStateAndPagination({ transactionGroups: res.body! }, res);
        }),
        catchError((err: HttpErrorResponse) => {
          this.setTransactionGroupsError(err);
          return EMPTY;
        })
      );
  }

  private setTransactionGroupsError(errors: HttpErrorResponse) {
    const state = this.state.getValue();
    this.setState({
      errors: this.updateErrorMessage(errors),
      pagination: {
        ...state.pagination,
        loading: false,
        initialLoadComplete: true,
      },
    });
  }

  private updateErrorMessage(err: HttpErrorResponse): string[] {
    if (err.error) {
      const errorValues: string[][] = Object.values<string[]>(err.error);
      return errorValues.reduce((a, v) => a.concat(v), []);
    } else {
      return [err.message];
    }
  }
}

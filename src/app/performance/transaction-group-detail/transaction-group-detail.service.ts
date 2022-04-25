import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { EMPTY } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { TransactionGroup } from "src/app/api/transactions/transactions.interfaces";
import { TransactionGroupsAPIService } from "src/app/api/transactions/transaction-groups-api.service";

interface TransactionGroupDetailState {
  transactionGroup: TransactionGroup | null;
  transactionGroupLoading: boolean;
  transactionGroupInitialLoadComplete: boolean;
}

const initialState: TransactionGroupDetailState = {
  transactionGroup: null,
  transactionGroupLoading: false,
  transactionGroupInitialLoadComplete: false,
};

@Injectable({
  providedIn: "root",
})
export class TransactionGroupDetailService extends StatefulService<TransactionGroupDetailState> {
  readonly transactionGroup$ = this.getState$.pipe(
    map((state) => state.transactionGroup)
  );

  readonly transactionGroupLoading$ = this.getState$.pipe(
    map((state) => state.transactionGroupLoading)
  );
  readonly transactionGroupInitialLoadComplete$ = this.getState$.pipe(
    map((state) => state.transactionGroupInitialLoadComplete)
  );

  constructor(
    private transactionGroupsAPIService: TransactionGroupsAPIService
  ) {
    super(initialState);
  }

  retrieveTransactionGroup(orgSlug: string, transactionGroupId: number) {
    this.setState({ transactionGroupLoading: true });
    return this.transactionGroupsAPIService
      .retrieve(transactionGroupId, orgSlug)
      .pipe(
        tap((res) => this.setTransactionGroup(res)),
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            this.clearTransactionGroup();
          }
          return EMPTY;
        })
      );
  }

  private setTransactionGroup(transactionGroup: TransactionGroup) {
    this.setState({
      transactionGroup,
      transactionGroupLoading: false,
      transactionGroupInitialLoadComplete: true,
    });
  }

  private clearTransactionGroup() {
    this.setState({
      transactionGroup: null,
      transactionGroupLoading: false,
      transactionGroupInitialLoadComplete: true,
    });
  }
}

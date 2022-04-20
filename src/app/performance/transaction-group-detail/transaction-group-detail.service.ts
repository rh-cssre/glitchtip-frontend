import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { map, tap } from "rxjs/operators";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { TransactionGroup } from "src/app/api/transactions/transactions.interfaces";
import { TransactionGroupsAPIService } from "src/app/api/transactions/transaction-groups-api.service";

interface TransactionGroupDetailState {
  transactionGroup: TransactionGroup | null;
}

const initialState: TransactionGroupDetailState = {
  transactionGroup: null,
};

@Injectable({
  providedIn: "root",
})
export class TransactionGroupDetailService extends StatefulService<TransactionGroupDetailState> {
  readonly transactionGroup$ = this.getState$.pipe(
    map((state) => state.transactionGroup)
  );

  constructor(
    private transactionGroupsAPIService: TransactionGroupsAPIService
  ) {
    super(initialState);
  }

  getTransactionGroup(orgSlug: string, transactionGroupId: string) {
    lastValueFrom(this.retrieveTransactionGroups(orgSlug, transactionGroupId));
  }

  private retrieveTransactionGroups(
    orgSlug: string,
    transactionGroupId: string
  ) {
    return this.transactionGroupsAPIService
      .retrieve(orgSlug, transactionGroupId)
      .pipe(
        tap((res) => {
          this.setState({ transactionGroup: res });
        })
      );
  }
}

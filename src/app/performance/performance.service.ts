import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { combineLatest, EMPTY } from "rxjs";
import { catchError, filter, map, tap } from "rxjs/operators";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { TransactionGroupsAPIService } from "../api/transactions/transaction-groups-api.service";
import { TransactionGroup } from "../api/transactions/transactions.interfaces";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";

export interface PerformanceState extends PaginationStatefulServiceState {
  transactionGroups: TransactionGroup[];
  errors: string[];
}

const initialState: PerformanceState = {
  transactionGroups: [],
  errors: [],
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class PerformanceService extends PaginationStatefulService<PerformanceState> {
  transactionGroups$ = this.getState$.pipe(
    map((state) => state.transactionGroups)
  );

  transactionGroupsDisplay$ = combineLatest([
    this.organizationsService.activeOrganizationProjects$,
    this.transactionGroups$,
  ]).pipe(
    filter(([projects, groups]) => !!projects && !!groups),
    map(([projects, groups]) => {
      return groups.map((group) => {
        const projectSlug = projects?.find(
          (project) => project.id === group.project
        )?.name;
        return {
          ...group,
          projectSlug,
        };
      });
    })
  );

  errors$ = this.getState$.pipe(map((state) => state.errors));

  constructor(
    private transactionGroupsAPIService: TransactionGroupsAPIService,
    private organizationsService: OrganizationsService
  ) {
    super(initialState);
  }

  getTransactionGroups(
    orgSlug: string,
    cursor: string | undefined,
    project: string[] | null,
    start: string | undefined,
    end: string | undefined,
    sort: string | undefined,
    environment: string | undefined,
    query: string | undefined
  ) {
    this.retrieveTransactionGroups(
      orgSlug,
      cursor,
      project,
      start,
      end,
      sort,
      environment,
      query
    ).subscribe();
  }

  private retrieveTransactionGroups(
    orgSlug: string,
    cursor?: string,
    project?: string[] | null,
    start?: string,
    end?: string,
    sort?: string,
    environment?: string,
    query?: string
  ) {
    this.setLoadingStart();
    return this.transactionGroupsAPIService
      .list(orgSlug, cursor, project, start, end, sort, environment, query)
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

  private setLoadingStart() {
    const state = this.state.getValue();
    this.setState({
      errors: [],
      pagination: {
        ...state.pagination,
        loading: true,
        initialLoadComplete: false,
      },
    });
  }
}

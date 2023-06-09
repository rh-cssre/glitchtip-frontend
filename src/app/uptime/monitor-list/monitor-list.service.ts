import { Injectable } from "@angular/core";
import { catchError, map, tap } from "rxjs/operators";
import { lastValueFrom, EMPTY } from "rxjs";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../../shared/stateful-service/pagination-stateful-service";
import { MonitorDetail } from "../uptime.interfaces";
import { MonitorsAPIService } from "../../api/monitors/monitors-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface MonitorListState extends PaginationStatefulServiceState {
  monitors: MonitorDetail[];
}

const initialState: MonitorListState = {
  monitors: [],
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class MonitorListService extends PaginationStatefulService<MonitorListState> {
  monitors$ = this.getState$.pipe(map((state) => state.monitors));

  constructor(
    private monitorsAPIService: MonitorsAPIService,
    private snackBar: MatSnackBar
  ) {
    super(initialState);
  }

  getMonitors(organizationSlug: string, cursor: string | null) {
    this.setGetMonitorsStart();
    lastValueFrom(
      this.monitorsAPIService.list(organizationSlug, cursor).pipe(
        tap((res) => {
          this.setStateAndPagination({ monitors: res.body! }, res);
        }),
        catchError(() => {
          this.setGetMonitorsError();
          this.snackBar.open(
            "There was an error retrieving your uptime monitors. Please try again."
          );
          return EMPTY;
        })
      )
    );
  }

  private setGetMonitorsStart() {
    const state = this.state.getValue();
    this.setState({
      pagination: {
        ...state.pagination,
        loading: true,
      },
    });
  }

  private setGetMonitorsError() {
    const state = this.state.getValue();
    this.setState({
      pagination: {
        ...state.pagination,
        loading: false,
      },
    });
  }
}

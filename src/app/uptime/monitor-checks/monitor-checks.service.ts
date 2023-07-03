import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "src/app/shared/stateful-service/pagination-stateful-service";
import { MonitorCheck } from "../uptime.interfaces";
import { MonitorChecksAPIService } from "src/app/api/monitors/monitor-checks-API.service";

export interface MonitorChecksState extends PaginationStatefulServiceState {
  monitorChecks: MonitorCheck[];
  isChange: boolean;
}

const initialState: MonitorChecksState = {
  monitorChecks: [],
  isChange: true,
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class MonitorChecksService extends PaginationStatefulService<MonitorChecksState> {
  monitorChecks$ = this.getState$.pipe(map((state) => state.monitorChecks));
  isChange$ = this.getState$.pipe(map((state) => state.isChange));

  constructor(private monitorChecksAPIService: MonitorChecksAPIService) {
    super(initialState);
  }

  retrieveMonitorChecks(
    orgSlug: string,
    monitorId: string,
    isChange: boolean,
    cursor?: string | null
  ) {
    this.setRetrieveMonitorChecksStart();
    return this.monitorChecksAPIService
      .list(orgSlug, monitorId, cursor, isChange)
      .pipe(
        tap((res) => {
          this.setStateAndPagination(
            {
              monitorChecks: res.body!,
            },
            res
          );
        })
      );
  }

  setRetrieveMonitorChecksStart() {
    const state = this.state.getValue();
    this.setState({ pagination: { ...state.pagination, loading: true } });
  }

  toggleIsChange() {
    const state = this.state.getValue();
    this.setState({ ...initialState, isChange: !state.isChange });
  }
}
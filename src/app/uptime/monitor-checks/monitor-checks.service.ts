import { Injectable, inject } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { components } from "src/app/api/api-schema";
import { MonitorChecksAPIService } from "src/app/api/monitors/monitor-checks-API.service";
import {
  PaginationStatefulService,
  PaginationStatefulServiceState,
  initialPaginationState,
} from "src/app/shared/stateful-service/pagination-stateful-service";

type MonitorCheck = components["schemas"]["MonitorCheckSchema"];

export interface MonitorChecksState extends PaginationStatefulServiceState {
  monitorChecks: MonitorCheck[];
}

const initialState: MonitorChecksState = {
  monitorChecks: [],
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class MonitorChecksService extends PaginationStatefulService<MonitorChecksState> {
  private monitorChecksAPIService = inject(MonitorChecksAPIService);

  monitorChecks$ = this.getState$.pipe(map((state) => state.monitorChecks));

  constructor() {
    super(initialState);
  }

  retrieveMonitorChecks(
    orgSlug: string,
    monitorId: string,
    isChange: boolean,
    cursor: string | null,
  ) {
    this.setRetrieveMonitorChecksStart();
    return this.monitorChecksAPIService
      .list(orgSlug, monitorId, cursor, isChange)
      .pipe(
        tap((res) => {
          this.setStateAndPagination(
            {
              monitorChecks: res.body as any,
            },
            res,
          );
        }),
      );
  }

  setRetrieveMonitorChecksStart() {
    const state = this.state.getValue();
    this.setState({ pagination: { ...state.pagination, loading: true } });
  }
}

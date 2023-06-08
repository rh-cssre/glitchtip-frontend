import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { lastValueFrom } from "rxjs";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "src/app/shared/stateful-service/pagination-stateful-service";
import { MonitorCheck } from "../uptime.interfaces";
import { MonitorChecksAPIService } from "src/app/api/monitors/monitor-checks-API.service";

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
  monitorChecks$ = this.getState$.pipe(map((state) => state.monitorChecks));

  constructor(private monitorChecksAPIService: MonitorChecksAPIService) {
    super(initialState);
  }

  retrieveMonitorChecks(
    orgSlug: string,
    monitorId: string,
    cursor?: string | undefined
  ) {
    this.setRetrieveMonitorChecksStart();
    lastValueFrom(
      this.monitorChecksAPIService.list(orgSlug, monitorId, cursor).pipe(
        tap((res) => {
          this.setStateAndPagination(
            {
              monitorChecks: res.body!,
            },
            res
          );
        })
      )
    );
  }

  setRetrieveMonitorChecksStart() {
    const state = this.state.getValue();
    this.setState({ pagination: { ...state.pagination, loading: true } });
  }
}

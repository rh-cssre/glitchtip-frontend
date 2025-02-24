import { Injectable, inject } from "@angular/core";
import { map } from "rxjs/operators";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../../shared/stateful-service/pagination-stateful-service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { client } from "src/app/api/api";
import { components } from "src/app/api/api-schema";

type MonitorDetail = components["schemas"]["MonitorDetailSchema"];

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
  private snackBar = inject(MatSnackBar);

  monitors$ = this.getState$.pipe(map((state) => state.monitors));

  constructor() {
    super(initialState);
  }

  getMonitors(organizationSlug: string, cursor: string | null) {
    this.setGetMonitorsStart();
    client
      .GET("/api/0/organizations/{organization_slug}/monitors/", {
        params: { path: { organization_slug: organizationSlug } },
      })
      .then((result) => {
        if (result.data) {
          this.setStateAndPagination(
            { monitors: result.data as any },
            result.response as any
          );
        } else {
          this.setGetMonitorsError();
          this.snackBar.open(
            "There was an error retrieving your uptime monitors. Please try again."
          );
        }
      });
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

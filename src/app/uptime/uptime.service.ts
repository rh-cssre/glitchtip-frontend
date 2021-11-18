import { Injectable } from "@angular/core";
import { map, tap, catchError } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState
} from "../shared/stateful-service/pagination-stateful-service";
import { Monitor, NewMonitor } from "./uptime.interfaces";
import { Environment } from "../api/organizations/organizations.interface";
import { MonitorsAPIService } from "../api/monitors/monitors-api.service";


export interface UptimeState extends PaginationStatefulServiceState {
  monitors: Monitor[];
  orgEnvironments: Environment[];
  monitorDetails: Monitor | null;
  deleteLoading: boolean;
}

const initialState: UptimeState = {
  monitors: [],
  pagination: initialPaginationState,
  orgEnvironments: [],
  monitorDetails: null,
  deleteLoading: false
};

@Injectable({
  providedIn: "root"
})

export class UptimeService extends PaginationStatefulService<UptimeState> {
  monitors$ = this.getState$.pipe(map((state) => state.monitors));
  deleteLoading$ = this.getState$.pipe(map((state) => state.deleteLoading));
  orgEnvironments$ = this.getState$.pipe(map((state) => state.orgEnvironments));
  readonly activeMonitor$ = this.getState$.pipe(
    map((data) => data.monitorDetails)
  );

  constructor(
    private monitorsAPIService: MonitorsAPIService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super(initialState);
  }

  createMonitor(monitor: NewMonitor, orgSlug: string) {
    return this.monitorsAPIService
      .createMonitor(orgSlug, monitor);
  }

  getMonitors(
    orgSlug: string,
    cursor?: string | undefined
  ) {
    this.retrieveMonitors(
      orgSlug,
      cursor,
    ).toPromise();
  }


  private retrieveMonitors(
    organizationSlug: string,
    cursor?: string | undefined
  ) {
    return this.monitorsAPIService
      .list(
        organizationSlug,
        cursor
      )
      .pipe(
        tap((res) => {
          this.setStateAndPagination({ monitors: res.body! }, res);
        }));
  }

  editMonitor(
    orgSlug: string,
    monitorId: string,
    data: Partial<Monitor>
  ) {
    return this.updateMonitor(
      orgSlug,
      monitorId,
      data
    );
  }

  private updateMonitor(
    orgSlug: string,
    monitorId: string,
    data: Partial<Monitor>
  ) {
    return this.monitorsAPIService
      .update(
        orgSlug,
        monitorId,
        data
      );
  }

  retrieveMonitorDetails(organizationSlug?: string, monitorId?: string) {
    if (organizationSlug && monitorId) {
      this.monitorsAPIService
        .retrieve(organizationSlug, monitorId)
        .pipe(tap((activeMonitor) => this.setActiveMonitor(activeMonitor)))
        .subscribe();
    }
  }


  private setActiveMonitor(monitor: Monitor) {
    this.setState({
      monitorDetails: monitor,
    });
  }

  deleteMonitor(orgSlug: string, monitorId: string) {
    this.setState({
      deleteLoading: true,
    });
    this.monitorsAPIService
      .destroy(orgSlug, monitorId)
      .pipe(
        tap(() => {
          this.setState({
            deleteLoading: false,
          });
          this.snackBar.open("Monitor has been deleted.");
          this.router.navigate([orgSlug, "uptime-monitors"]);
        }),
        catchError((_) => {
          this.setState({
            deleteLoading: false,
          });
          this.snackBar.open(
            `There was an error deleting this issue. Please try again.`
          );
          return EMPTY;
        })
      ).subscribe();
  }

  clearState() {
    this.state.next(initialState);
  }
}


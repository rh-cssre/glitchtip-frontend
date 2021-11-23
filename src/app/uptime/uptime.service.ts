import { Injectable } from "@angular/core";
import { map, tap, catchError, filter, mergeMap, take } from "rxjs/operators";
import { EMPTY, combineLatest } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";
import { MonitorDetail, NewMonitor } from "./uptime.interfaces";
import { Environment } from "../api/organizations/organizations.interface";
import { MonitorsAPIService } from "../api/monitors/monitors-api.service";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { HttpErrorResponse } from "@angular/common/http";

export interface UptimeState extends PaginationStatefulServiceState {
  monitors: MonitorDetail[];
  orgEnvironments: Environment[];
  monitorDetails: MonitorDetail | null;
  editLoading: boolean;
  createLoading: boolean;
  deleteLoading: boolean;
  error: string;
}

const initialState: UptimeState = {
  monitors: [],
  pagination: initialPaginationState,
  orgEnvironments: [],
  monitorDetails: null,
  editLoading: false,
  createLoading: false,
  deleteLoading: false,
  error: "",
};

@Injectable({
  providedIn: "root",
})
export class UptimeService extends PaginationStatefulService<UptimeState> {
  monitors$ = this.getState$.pipe(map((state) => state.monitors));
  editLoading$ = this.getState$.pipe(map((state) => state.editLoading));
  createLoading$ = this.getState$.pipe(map((state) => state.createLoading));
  deleteLoading$ = this.getState$.pipe(map((state) => state.deleteLoading));
  error$ = this.getState$.pipe(map((state) => state.error));
  orgEnvironments$ = this.getState$.pipe(map((state) => state.orgEnvironments));
  readonly activeMonitor$ = this.getState$.pipe(
    map((data) => data.monitorDetails)
  );

  constructor(
    private monitorsAPIService: MonitorsAPIService,
    private organizationsService: OrganizationsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super(initialState);
  }

  createMonitor(monitor: NewMonitor) {
    this.organizationsService.activeOrganizationSlug$
      .pipe(
        tap((orgSlug) => {
          if (orgSlug) {
            this.setState({
              createLoading: true,
            });
            this.monitorsAPIService
              .createMonitor(orgSlug, monitor)
              .pipe(
                tap((monitor) => {
                  this.setState({
                    createLoading: false,
                  });
                  this.snackBar.open(`${monitor.name} has been created`);
                  this.router.navigate([
                    orgSlug,
                    "uptime-monitors",
                    monitor.id,
                  ]);
                }),
                catchError((err) => {
                  this.setState({
                    createLoading: false,
                  });
                  if (err instanceof HttpErrorResponse) {
                    this.setState({
                      error: err.error,
                    });
                  }
                  return EMPTY;
                })
              )
              .toPromise();
          }
        })
      )
      .toPromise();
  }

  getMonitors(orgSlug: string, cursor?: string | undefined) {
    this.retrieveMonitors(orgSlug, cursor).toPromise();
  }

  private retrieveMonitors(
    organizationSlug: string,
    cursor?: string | undefined
  ) {
    return this.monitorsAPIService.list(organizationSlug, cursor).pipe(
      tap((res) => {
        this.setStateAndPagination({ monitors: res.body! }, res);
      })
    );
  }

  editMonitor(data: Partial<MonitorDetail>) {
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.activeMonitor$,
    ])
      .pipe(
        take(1),
        filter(([orgSlug, monitor]) => !!orgSlug && !!monitor),
        tap(([orgSlug, monitor]) => {
          this.setState({
            editLoading: true,
          });
          this.updateMonitor(orgSlug!, monitor!.id, data).pipe(
            tap((updatedMonitor) => {
              this.setState({
                editLoading: false,
              });
              this.snackBar.open(`${updatedMonitor.name} has been updated`);
              this.router.navigate([
                orgSlug,
                "uptime-monitors",
                updatedMonitor.id,
              ]);
            }),
            catchError((err) => {
              this.setState({
                editLoading: false,
              });
              if (err instanceof HttpErrorResponse) {
                this.setState({
                  error: err.error,
                });
              }
              return EMPTY;
            })
          ).toPromise()
        })
      )
      .toPromise();
  }

  private updateMonitor(
    orgSlug: string,
    monitorId: string,
    data: Partial<MonitorDetail>
  ) {
    return this.monitorsAPIService.update(orgSlug, monitorId, data);
  }

  retrieveMonitorDetails(monitorId?: string) {
    this.organizationsService.activeOrganizationSlug$
      .pipe(
        filter((orgSlug) => !!orgSlug),
        mergeMap((orgSlug) => {
          if (monitorId) {
            this.monitorsAPIService
              .retrieve(orgSlug!, monitorId)
              .pipe(
                tap((activeMonitor) => this.setActiveMonitor(activeMonitor))
              )
              .subscribe();
          }
          return EMPTY;
        })
      )
      .toPromise();
  }

  private setActiveMonitor(monitor: MonitorDetail) {
    this.setState({
      monitorDetails: monitor,
    });
  }

  deleteMonitor() {
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.activeMonitor$,
    ])
      .pipe(
        take(1),
        filter(([orgSlug, monitor]) => !!orgSlug && !!monitor),
        tap(([orgSlug, monitor]) => {
          this.setState({
            editLoading: true,
          });
          this.monitorsAPIService
          .destroy(orgSlug!, monitor!.id)
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
          )
          .toPromise()
        })
      )
      .toPromise();
  }

  // deleteMonitor(orgSlug: string, monitorId: string) {
  //   this.setState({
  //     deleteLoading: true,
  //   });
  //   this.monitorsAPIService
  //     .destroy(orgSlug, monitorId)
  //     .pipe(
  //       tap(() => {
  //         this.setState({
  //           deleteLoading: false,
  //         });
  //         this.snackBar.open("Monitor has been deleted.");
  //         this.router.navigate([orgSlug, "uptime-monitors"]);
  //       }),
  //       catchError((_) => {
  //         this.setState({
  //           deleteLoading: false,
  //         });
  //         this.snackBar.open(
  //           `There was an error deleting this issue. Please try again.`
  //         );
  //         return EMPTY;
  //       })
  //     )
  //     .subscribe();
  // }

  clearState() {
    this.state.next(initialState);
  }
}

import { Injectable } from "@angular/core";
import { map, tap, catchError, filter, take } from "rxjs/operators";
import { EMPTY, combineLatest } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";
import { MonitorCheck, MonitorDetail, MonitorInput } from "./uptime.interfaces";
import { Environment } from "../api/organizations/organizations.interface";
import { MonitorsAPIService } from "../api/monitors/monitors-api.service";
import { MonitorChecksAPIService } from "../api/monitors/monitor-checks-API.service";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ProjectAlertsAPIService } from "../api/projects/project-alerts/project-alerts.service";

export interface UptimeState extends PaginationStatefulServiceState {
  monitors: MonitorDetail[];
  monitorChecks: MonitorCheck[];
  orgEnvironments: Environment[];
  monitorDetails: MonitorDetail | null;
  configuredAlerts: number | null;
  associatedProjectSlug: string | null;
  editLoading: boolean;
  createLoading: boolean;
  deleteLoading: boolean;
  error: string;
}

const initialState: UptimeState = {
  monitors: [],
  monitorChecks: [],
  pagination: initialPaginationState,
  orgEnvironments: [],
  monitorDetails: null,
  configuredAlerts: null,
  associatedProjectSlug: null,
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
  monitorChecks$ = this.getState$.pipe(map((state) => state.monitorChecks));
  editLoading$ = this.getState$.pipe(map((state) => state.editLoading));
  createLoading$ = this.getState$.pipe(map((state) => state.createLoading));
  deleteLoading$ = this.getState$.pipe(map((state) => state.deleteLoading));
  error$ = this.getState$.pipe(map((state) => state.error));
  orgEnvironments$ = this.getState$.pipe(map((state) => state.orgEnvironments));
  configuredAlerts$ = this.getState$.pipe(map((state) => state.configuredAlerts));
  associatedProjectSlug$ = this.getState$.pipe(map((state) => state.associatedProjectSlug));
  readonly activeMonitor$ = this.getState$.pipe(
    map((data) => data.monitorDetails)
  );
  

  constructor(
    private monitorsAPIService: MonitorsAPIService,
    private monitorChecksAPIService: MonitorChecksAPIService,
    private organizationsService: OrganizationsService,
    private projectAlertsService: ProjectAlertsAPIService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super(initialState);
  }

  createMonitor(monitor: MonitorInput) {
    this.organizationsService.activeOrganizationSlug$
      .pipe(
        take(1),
        tap((orgSlug) => {
          if (orgSlug) {
            this.setState({
              createLoading: true,
            });
            this.monitorsAPIService
              .createMonitor(orgSlug, monitor)
              .pipe(
                tap((newMonitor) => {
                  this.setState({
                    createLoading: false,
                  });
                  this.snackBar.open(`${newMonitor.name} has been created`);
                  this.router.navigate([
                    orgSlug,
                    "uptime-monitors",
                    newMonitor.id,
                  ]);
                }),
                catchError((err) => {
                  this.setState({
                    createLoading: false,
                  });
                  if (err instanceof HttpErrorResponse) {
                    this.setState({
                      error: `${err.statusText}: ${err.status}`,
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

  editMonitor(data: MonitorInput) {
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
          this.updateMonitor(orgSlug!, monitor!.id, data)
            .pipe(
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
                    error: `${err.statusText}: ${err.status}`,
                  });
                }
                return EMPTY;
              })
            )
            .toPromise();
        })
      )
      .toPromise();
  }

  private updateMonitor(
    orgSlug: string,
    monitorId: string,
    data: MonitorInput
  ) {
    return this.monitorsAPIService.update(orgSlug, monitorId, data);
  }

  retrieveMonitorDetails(orgSlug: string, monitorId: string) {
    this.monitorsAPIService
      .retrieve(orgSlug, monitorId)
      .pipe(
        tap((activeMonitor) => {
          this.setActiveMonitor(activeMonitor);
          if (activeMonitor.project) {
            this.countConfiguredAlerts(orgSlug, activeMonitor.project);
          }
        })
      )
      .toPromise();
  }

  retrieveMonitorChecks(
    orgSlug: string,
    monitorId: string,
    cursor?: string | undefined
  ) {
    this.startPaginatedLoading();
    this.monitorChecksAPIService
      .list(orgSlug, monitorId, cursor)
      .pipe(
        tap((res) => {
          this.setStateAndPagination(
            {
              monitorChecks: res.body!,
            },
            res
          );
        })
      )
      .toPromise();
  }

  countConfiguredAlerts(orgSlug: string, projectId: number) {
    this.organizationsService.activeOrganization$
      .pipe(
        take(1),
        tap((orgDetail) => {
          const projectSlug = orgDetail?.projects.filter(
            (project) => project.id === projectId
          )[0]?.slug;
          console.log(projectSlug)
          if (projectSlug) {
            this.projectAlertsService.list(orgSlug, projectSlug).pipe(
              tap((projectAlerts) => {
                this.setState({
                  associatedProjectSlug: projectSlug,
                  configuredAlerts: projectAlerts.length,
                });
                console.log(projectAlerts.length);
              })
            ).toPromise();
          }
        })
      )
      .toPromise();
  }

  startPaginatedLoading() {
    const state = this.state.getValue();
    this.setState({ pagination: { ...state.pagination, loading: true } });
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
            .toPromise();
        })
      )
      .toPromise();
  }

  clearState() {
    this.state.next(initialState);
  }
}

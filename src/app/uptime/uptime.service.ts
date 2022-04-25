import { Injectable } from "@angular/core";
import { map, tap, catchError, filter, take } from "rxjs/operators";
import { EMPTY, combineLatest, lastValueFrom } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";
import {
  MonitorCheck,
  MonitorDetail,
  MonitorInput,
  ResponseTimeSeries,
} from "./uptime.interfaces";
import { MonitorsAPIService } from "../api/monitors/monitors-api.service";
import { MonitorChecksAPIService } from "../api/monitors/monitor-checks-API.service";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ProjectAlertsAPIService } from "../api/projects/project-alerts/project-alerts.service";
import { SettingsService } from "../api/settings.service";
import { SubscriptionsService } from "../api/subscriptions/subscriptions.service";
import { timedeltaToMS } from "src/app/shared/shared.utils";

export interface UptimeState extends PaginationStatefulServiceState {
  monitors: MonitorDetail[];
  monitorChecks: MonitorCheck[];
  monitorDetails: MonitorDetail | null;
  uptimeAlertCount: number | null;
  alertCountLoading: boolean;
  editLoading: boolean;
  createLoading: boolean;
  deleteLoading: boolean;
  error: string;
}

const initialState: UptimeState = {
  monitors: [],
  monitorChecks: [],
  pagination: initialPaginationState,
  monitorDetails: null,
  uptimeAlertCount: null,
  alertCountLoading: true,
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
  uptimeAlertCount$ = this.getState$.pipe(
    map((state) => state.uptimeAlertCount)
  );
  readonly alertCountLoading$ = this.getState$.pipe(
    map((data) => data.alertCountLoading)
  );
  readonly activeMonitor$ = this.getState$.pipe(
    map((data) => data.monitorDetails)
  );
  associatedProjectSlug$ = combineLatest([
    this.organizationsService.activeOrganizationProjects$,
    this.activeMonitor$,
  ]).pipe(
    map(
      ([projects, monitor]) =>
        projects?.find((project) => project.id === monitor?.project)?.slug
    )
  );
  activeMonitorRecentChecksSeries$ = this.activeMonitor$.pipe(
    map((monitor) =>
      monitor?.checks.length ? this.convertChecksToSeries(monitor.checks) : null
    )
  );

  constructor(
    private monitorsAPIService: MonitorsAPIService,
    private monitorChecksAPIService: MonitorChecksAPIService,
    private organizationsService: OrganizationsService,
    private projectAlertsService: ProjectAlertsAPIService,
    private settingsService: SettingsService,
    private subscriptionsService: SubscriptionsService,
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

  callSubscriptionDetails() {
    lastValueFrom(
      this.settingsService.billingEnabled$.pipe(
        tap((billingEnabled) => {
          if (billingEnabled) {
            lastValueFrom(
              this.organizationsService.activeOrganizationSlug$.pipe(
                filter((slug) => !!slug),
                take(1),
                tap((slug) => {
                  if (slug) {
                    lastValueFrom(
                      this.subscriptionsService.retrieveSubscription(slug)
                    );
                  }
                })
              )
            );
          }
        })
      )
    );
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
    this.setState({
      alertCountLoading: true,
    });
    this.monitorsAPIService
      .retrieve(orgSlug, monitorId)
      .pipe(
        tap((activeMonitor) => {
          this.setActiveMonitor(activeMonitor);
          if (activeMonitor.project) {
            this.countUptimeAlerts(orgSlug);
          } else {
            this.setState({
              alertCountLoading: false,
            });
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

  countUptimeAlerts(orgSlug: string) {
    lastValueFrom(
      this.associatedProjectSlug$.pipe(
        filter((projectSlug) => !!projectSlug),
        take(1),
        tap((projectSlug) => {
          if (projectSlug) {
            lastValueFrom(
              this.projectAlertsService.list(orgSlug, projectSlug).pipe(
                tap((projectAlerts) => {
                  this.setState({
                    uptimeAlertCount: projectAlerts.filter(
                      (alert) => alert.uptime === true
                    ).length,
                    alertCountLoading: false,
                  });
                })
              )
            );
          }
        })
      )
    );
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

  formatData(check: MonitorCheck) {
    return {
      name: new Date(check.startCheck),
      value: check.responseTime ? timedeltaToMS(check.responseTime) : 0,
    };
  }

  convertChecksToSeries(input: MonitorCheck[]) {
    return input.reduce(
      (resultArray, check) => {
        const lastEntry = resultArray[resultArray.length - 1];
        if (
          !lastEntry.series.length ||
          (lastEntry.name === "Up" && check.isUp) ||
          (lastEntry.name === "Down" && !check.isUp)
        ) {
          lastEntry.series.push(this.formatData(check));
        } else {
          resultArray.push({
            name: check.isUp ? "Up" : "Down",
            series: [this.formatData(check)],
          });
        }
        return resultArray;
      },
      [
        {
          name: input[0].isUp ? "Up" : "Down",
          series: [],
        },
      ] as ResponseTimeSeries[]
    );
  }
}

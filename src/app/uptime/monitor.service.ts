import { Injectable } from "@angular/core";
import { map, tap, catchError, filter, take } from "rxjs/operators";
import { EMPTY, combineLatest, lastValueFrom } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import {
  MonitorCheck,
  MonitorDetail,
  MonitorInput,
  ResponseTimeSeries,
} from "./uptime.interfaces";
import { MonitorsAPIService } from "../api/monitors/monitors-api.service";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ProjectAlertsAPIService } from "../api/projects/project-alerts/project-alerts.service";
import { SettingsService } from "../api/settings.service";
import { SubscriptionsService } from "../api/subscriptions/subscriptions.service";
import { ServerError } from "../shared/django.interfaces";

export interface MonitorState {
  monitorDetails: MonitorDetail | null;
  uptimeAlertCount: number | null;
  alertCountLoading: boolean;
  editLoading: boolean;
  createLoading: boolean;
  deleteLoading: boolean;
  error: ServerError | null;
}

const initialState: MonitorState = {
  monitorDetails: null,
  uptimeAlertCount: null,
  alertCountLoading: true,
  editLoading: false,
  createLoading: false,
  deleteLoading: false,
  error: null,
};

@Injectable({
  providedIn: "root",
})
export class MonitorService extends StatefulService<MonitorState> {
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
    lastValueFrom(
      this.organizationsService.activeOrganizationSlug$.pipe(
        take(1),
        tap((orgSlug) => {
          if (orgSlug) {
            this.setCreateMonitorStart();
            lastValueFrom(
              this.monitorsAPIService.createMonitor(orgSlug, monitor).pipe(
                tap((newMonitor) => {
                  this.setCreateMonitorEnd();
                  this.snackBar.open(`${newMonitor.name} has been created`);
                  this.router.navigate([
                    orgSlug,
                    "uptime-monitors",
                    newMonitor.id,
                  ]);
                }),
                catchError((err) => this.processError(err))
              )
            );
          }
        })
      )
    );
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
                    this.subscriptionsService.retrieveSubscription(slug);
                  }
                })
              )
            );
          }
        })
      )
    );
  }

  private processError(err: any) {
    if (err.status === 400) {
      this.setMonitorError(err.error);
    } else if (err instanceof HttpErrorResponse) {
      this.setMonitorError({
        non_field_errors: [`${err.statusText}: ${err.status}`],
      });
    } else {
      this.setMonitorError({
        non_field_errors: [`There was an error updating this monitor.`],
      });
    }
    return EMPTY;
  }

  editMonitor(data: MonitorInput) {
    lastValueFrom(
      combineLatest([
        this.organizationsService.activeOrganizationSlug$,
        this.activeMonitor$,
      ]).pipe(
        take(1),
        filter(([orgSlug, monitor]) => !!orgSlug && !!monitor),
        tap(([orgSlug, monitor]) => {
          this.setEditMonitorStart();
          lastValueFrom(
            this.monitorsAPIService.update(orgSlug!, monitor!.id, data).pipe(
              tap((updatedMonitor) => {
                this.setEditMonitorEnd();
                this.snackBar.open(`${updatedMonitor.name} has been updated`);
                this.router.navigate([
                  orgSlug,
                  "uptime-monitors",
                  updatedMonitor.id,
                ]);
              }),
              catchError((err) => this.processError(err))
            )
          );
        })
      )
    );
  }

  retrieveMonitorDetails(orgSlug: string, monitorId: string) {
    lastValueFrom(
      this.monitorsAPIService.retrieve(orgSlug, monitorId).pipe(
        tap((monitor) => {
          this.countUptimeAlerts(orgSlug, monitor);
          this.setRetrieveMonitorDetailsEnd(monitor);
        }),
        catchError(() => {
          this.setRetrieveMonitorDetailsError();
          this.snackBar.open(
            `There was an error retrieving your monitor details. Please try again.`
          );
          return EMPTY;
        })
      )
    );
  }

  deleteMonitor() {
    lastValueFrom(
      combineLatest([
        this.organizationsService.activeOrganizationSlug$,
        this.activeMonitor$,
      ]).pipe(
        take(1),
        filter(([orgSlug, monitor]) => !!orgSlug && !!monitor),
        tap(([orgSlug, monitor]) => {
          this.setDeleteMonitorStart();
          lastValueFrom(
            this.monitorsAPIService.destroy(orgSlug!, monitor!.id).pipe(
              tap(() => {
                this.setDeleteMonitorEnd();
                this.snackBar.open("Monitor has been deleted.");
                this.router.navigate([orgSlug, "uptime-monitors"]);
              }),
              catchError(() => {
                this.setDeleteMonitorError();
                this.snackBar.open(
                  `There was an error deleting this issue. Please try again.`
                );
                return EMPTY;
              })
            )
          );
        })
      )
    );
  }

  private countUptimeAlerts(orgSlug: string, monitor: MonitorDetail) {
    if (monitor.project) {
      this.setCountUptimeAlertsStart();
      lastValueFrom(
        this.associatedProjectSlug$.pipe(
          filter((projectSlug) => !!projectSlug),
          take(1),
          tap((projectSlug) => {
            if (projectSlug) {
              lastValueFrom(
                this.projectAlertsService.list(orgSlug, projectSlug).pipe(
                  tap((projectAlerts) => {
                    let alertCount = projectAlerts.filter(
                      (alert) => alert.uptime === true
                    ).length;
                    this.setCountUptimeAlertsEnd(alertCount);
                  }),
                  catchError(() => {
                    this.setCountUptimeAlertsError();
                    return EMPTY;
                  })
                )
              );
            }
          })
        )
      );
    }
  }

  private formatData(check: MonitorCheck) {
    return {
      name: new Date(check.startCheck),
      value: check.responseTime ?? 0,
    };
  }

  private convertChecksToSeries(input: MonitorCheck[]) {
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

  private setCreateMonitorStart() {
    this.setState({
      createLoading: true,
    });
  }

  private setCreateMonitorEnd() {
    this.setState({
      createLoading: false,
    });
  }

  private setMonitorError(error: ServerError) {
    this.setState({
      createLoading: false,
      editLoading: false,
      error,
    });
  }

  private setEditMonitorStart() {
    this.setState({
      editLoading: true,
    });
  }

  private setEditMonitorEnd() {
    this.setState({
      editLoading: false,
    });
  }

  private setRetrieveMonitorDetailsEnd(monitorDetails: MonitorDetail) {
    this.setState({
      monitorDetails,
    });
  }

  private setRetrieveMonitorDetailsError() {
    this.setState({
      alertCountLoading: false,
    });
  }

  private setDeleteMonitorStart() {
    this.setState({
      deleteLoading: true,
    });
  }

  private setDeleteMonitorEnd() {
    this.clearState();
  }

  private setDeleteMonitorError() {
    this.setState({
      deleteLoading: false,
    });
  }

  private setCountUptimeAlertsStart() {
    this.setState({
      alertCountLoading: true,
    });
  }

  private setCountUptimeAlertsEnd(uptimeAlertCount: number | null) {
    this.setState({
      uptimeAlertCount,
      alertCountLoading: false,
    });
  }

  private setCountUptimeAlertsError() {
    this.setState({
      alertCountLoading: false,
    });
  }
}

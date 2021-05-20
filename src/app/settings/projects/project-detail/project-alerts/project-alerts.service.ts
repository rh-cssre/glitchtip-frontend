import { Injectable } from "@angular/core";
// import { HttpErrorResponse } from "@angular/common/http";
// import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, combineLatest, EMPTY } from "rxjs";
import {
  tap,
  map,
  mergeMap,
  take,
  catchError,
  // exhaustMap,
} from "rxjs/operators";
import { OrganizationsService } from "../../../../api/organizations/organizations.service";
import { ProjectAlertsAPIService } from "../../../../api/projects/project-alerts/project-alerts.service";
import {
  AlertRecipient,
  // AlertRecipient,
  // NewProjectAlert,
  ProjectAlert,
} from "../../../../api/projects/project-alerts/project-alerts.interface";
import { ProjectSettingsService } from "../../project-settings.service";
import { HttpErrorResponse } from "@angular/common/http";

interface ProjectsState {
  projectAlerts: ProjectAlert[] | null;
  alertToggleLoading: boolean;
  alertToggleError: string;
  initialLoad: boolean;
  loading: boolean;
  error: string;
}

const initialState: ProjectsState = {
  projectAlerts: null,
  alertToggleLoading: false,
  alertToggleError: "",
  initialLoad: false,
  loading: false,
  error: "",
};

@Injectable({
  providedIn: "root",
})
export class ProjectAlertsService {
  private readonly projectAlertState = new BehaviorSubject<ProjectsState>(
    initialState
  );
  private readonly getState$ = this.projectAlertState.asObservable();

  readonly projectAlert$ = this.getState$.pipe(
    map((data) => data.projectAlerts)
  );
  readonly initialLoad$ = this.getState$.pipe(map((data) => data.initialLoad));
  readonly alertToggleLoading$ = this.getState$.pipe(
    map((data) => data.alertToggleLoading)
  );
  readonly alertToggleError$ = this.getState$.pipe(
    map((data) => data.alertToggleError)
  );
  readonly loading$ = this.getState$.pipe(map((data) => data.loading));
  readonly error$ = this.getState$.pipe(map((data) => data.error));

  constructor(
    private organizationsService: OrganizationsService,
    private projectSettingsService: ProjectSettingsService,
    private projectAlertsAPIService: ProjectAlertsAPIService // private snackBar: MatSnackBar
  ) {}

  listProjectAlerts() {
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
    ])
      .pipe(
        take(1),
        mergeMap(([orgSlug, projectSlug]) => {
          if (orgSlug && projectSlug) {
            return this.projectAlertsAPIService.list(orgSlug, projectSlug).pipe(
              tap((projectAlerts) => {
                this.setProjectAlertsList(projectAlerts);
              }),
              catchError((err: HttpErrorResponse) => {
                this.setProjectAlertsListError(err);
                return EMPTY;
              })
            );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  deleteProjectAlert(pk: number) {
    //TODO: loading state
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
    ])
      .pipe(
        mergeMap(([orgSlug, projectSlug]) => {
          if (orgSlug && projectSlug) {
            return this.projectAlertsAPIService
              .destroy(pk.toString(), orgSlug, projectSlug)
              .pipe(
                tap((_) => {
                  this.setDeleteProjectAlert(pk);
                })
              );
          }
          return EMPTY;
        }),
        catchError((err: HttpErrorResponse) => {
          console.log("error: ", err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  updateTimespanQuantity(newTimespan: number, newQuantity: number, pk: number) {
    console.log("update timespan quantity", newTimespan, newQuantity, pk);
  }

  deleteAlertRecipient(recipient: AlertRecipient) {
    console.log("remove: ", recipient);
  }

  /*
  toggleProjectAlerts() {
    this.setAlertToggleLoading(true);
    combineLatest([
      this.projectAlert$,
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
    ])
      .pipe(
        take(1),
        exhaustMap(([projectAlert, orgSlug, projectSlug]) => {
          if (orgSlug && projectSlug) {
            if (projectAlert) {
              return this.projectAlertsAPIService
                .destroy(projectAlert.pk.toString(), orgSlug, projectSlug)
                .pipe(
                  tap((_) => {
                    this.listProjectAlerts();
                    this.setAlertToggleLoading(false);
                  }),
                  catchError((error: HttpErrorResponse) => {
                    this.setAlertToggleLoading(false);
                    if (error) {
                      this.setAlertToggleError(
                        `${error.status}: ${error.name}/${error.statusText}`
                      );
                    }
                    return EMPTY;
                  })
                );
            } else {
              const data: NewProjectAlert = {
                timespan_minutes: 1,
                quantity: 1,
                alertRecipients: [
                  {
                    recipientType: "webhook",
                    url: "www.webhook.com",
                  },
                ],
              };
              return this.projectAlertsAPIService
                .create(data, orgSlug, projectSlug)
                .pipe(
                  tap((resp) => {
                    this.setAlertToggleLoading(false);
                    this.setActiveProjectAlert(resp);
                  }),
                  catchError((error: HttpErrorResponse) => {
                    this.setAlertToggleLoading(false);
                    if (error) {
                      this.setError(
                        `${error.status}: ${error.name}/${error.statusText}`
                      );
                    }
                    return EMPTY;
                  })
                );
            }
          }

          return EMPTY;
        })
      )
      .toPromise();
  }
  */

  /*
  updateProjectAlerts(
    timespan: number,
    amount: number,
    alertRecipients: AlertRecipient[]
  ) {
    this.setLoading(true);
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
      this.projectAlert$,
    ])
      .pipe(
        take(1),
        exhaustMap(([orgSlug, projectSlug, projectAlert]) => {
          if (orgSlug && projectSlug) {
            const data = {
              timespan_minutes: timespan,
              quantity: amount,
              alertRecipients,
            };
            if (projectAlert) {
              const pk = projectAlert?.pk.toString();
              return this.projectAlertsAPIService
                .update(pk, data, orgSlug, projectSlug)
                .pipe(
                  tap((resp) => {
                    this.setLoading(false);
                    this.setActiveProjectAlert(resp);
                  }),
                  catchError((error: HttpErrorResponse) => {
                    this.setLoading(false);
                    if (error.status === 404) {
                      this.snackBar.open(`Error: ${error.statusText}`);
                      this.setActiveProjectAlert(null);
                    } else {
                      this.setError(
                        `${error.status}: ${error.name}/${error.statusText}`
                      );
                    }
                    return EMPTY;
                  })
                );
            } else {
              this.toggleProjectAlerts();
            }
          }

          return EMPTY;
        })
      )
      .toPromise();
  }
  */

  clearState() {
    this.projectAlertState.next(initialState);
  }

  private setProjectAlertsList(alerts: ProjectAlert[]) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      projectAlerts: alerts,
      initialLoad: true,
    });
  }

  private setProjectAlertsListError(err: HttpErrorResponse) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      initialLoad: true,
      error: err.message,
      loading: false,
    });
  }

  private setDeleteProjectAlert(pk: number) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      projectAlerts:
        state.projectAlerts?.filter((alert) => alert.pk !== pk) ?? null,
      loading: false,
    });
  }

  // private setActiveProjectAlert(alert: ProjectAlert[] | null) {
  //   this.projectAlertState.next({
  //     ...this.projectAlertState.getValue(),
  //     projectAlerts: alert,
  //     initialLoad: true,
  //   });
  // }

  // private setAlertToggleLoading(isLoading: boolean) {
  //   this.projectAlertState.next({
  //     ...this.projectAlertState.getValue(),
  //     alertToggleLoading: isLoading,
  //   });
  // }

  // private setAlertToggleError(error: string) {
  //   this.projectAlertState.next({
  //     ...this.projectAlertState.getValue(),
  //     alertToggleError: error,
  //   });
  // }

  // private setError(err: string) {
  //   this.projectAlertState.next({
  //     ...this.projectAlertState.getValue(),
  //     error: err,
  //   });
  // }
}

import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, combineLatest, EMPTY } from "rxjs";
import {
  tap,
  map,
  mergeMap,
  take,
  catchError,
  exhaustMap,
} from "rxjs/operators";
import { OrganizationsService } from "../../../../api/organizations/organizations.service";
import { ProjectsService } from "../../../../projects/projects.service";
import { ProjectAlertsAPIService } from "../../../../api/projects/project-alerts/project-alerts.service";
import { ProjectAlert } from "../../../../api/projects/project-alerts/project-alerts.interface";

interface ProjectsState {
  projectAlerts: ProjectAlert | null;
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
    private projectsService: ProjectsService,
    private projectAlertsAPIService: ProjectAlertsAPIService,
    private snackBar: MatSnackBar
  ) {}

  listProjectAlerts() {
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectsService.activeProjectSlug$,
    ])
      .pipe(
        take(1),
        mergeMap(([orgSlug, projectSlug]) => {
          if (orgSlug && projectSlug) {
            return this.projectAlertsAPIService.list(orgSlug, projectSlug).pipe(
              tap((projectAlerts) => {
                if (projectAlerts.length) {
                  /** Not supporting multiple project alerts yet */
                  this.setActiveProjectAlert(projectAlerts[0]);
                } else {
                  this.setActiveProjectAlert(null);
                }
              })
            );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  toggleProjectAlerts() {
    this.setAlertToggleLoading(true);
    combineLatest([
      this.projectAlert$,
      this.organizationsService.activeOrganizationSlug$,
      this.projectsService.activeProjectSlug$,
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
              const data = {
                timespan_minutes: 1,
                quantity: 1,
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

  updateProjectAlerts(timespan: number, amount: number) {
    this.setLoading(true);
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectsService.activeProjectSlug$,
      this.projectAlert$,
    ])
      .pipe(
        take(1),
        exhaustMap(([orgSlug, projectSlug, projectAlert]) => {
          if (orgSlug && projectSlug) {
            const data = {
              timespan_minutes: timespan,
              quantity: amount,
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

  clearState() {
    this.projectAlertState.next(initialState);
  }

  private setActiveProjectAlert(alert: ProjectAlert | null) {
    this.projectAlertState.next({
      ...this.projectAlertState.getValue(),
      projectAlerts: alert,
      initialLoad: true,
    });
  }

  private setAlertToggleLoading(isLoading: boolean) {
    this.projectAlertState.next({
      ...this.projectAlertState.getValue(),
      alertToggleLoading: isLoading,
    });
  }

  private setAlertToggleError(error: string) {
    this.projectAlertState.next({
      ...this.projectAlertState.getValue(),
      alertToggleError: error,
    });
  }

  private setLoading(isLoading: boolean) {
    this.projectAlertState.next({
      ...this.projectAlertState.getValue(),
      loading: isLoading,
    });
  }

  private setError(err: string) {
    this.projectAlertState.next({
      ...this.projectAlertState.getValue(),
      error: err,
    });
  }
}

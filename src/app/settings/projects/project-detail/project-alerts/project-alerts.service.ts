import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, combineLatest, EMPTY } from "rxjs";
import { tap, map, mergeMap, take, catchError } from "rxjs/operators";
import { OrganizationsService } from "../../../../api/organizations/organizations.service";
import { ProjectAlertsAPIService } from "../../../../api/projects/project-alerts/project-alerts.service";
import {
  AlertRecipient,
  NewProjectAlert,
  ProjectAlert,
} from "../../../../api/projects/project-alerts/project-alerts.interface";
import { ProjectSettingsService } from "../../project-settings.service";
import { HttpErrorResponse } from "@angular/common/http";

interface ProjectsState {
  projectAlerts: ProjectAlert[] | null;
  initialLoad: boolean;
  initialLoadError: string | null;
  removeAlertLoading: number | null;
  removeAlertError: string | null;
  updateTimespanQuantityLoading: number | null;
  updateTimespanQuantityError: string | null;
  deleteRecipientLoading: number | null;
  deleteRecipientError: string | null;
}

const initialState: ProjectsState = {
  projectAlerts: null,
  initialLoad: false,
  initialLoadError: null,
  removeAlertLoading: null,
  removeAlertError: null,
  updateTimespanQuantityLoading: null,
  updateTimespanQuantityError: null,
  deleteRecipientLoading: null,
  deleteRecipientError: null,
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
  readonly initialLoadError$ = this.getState$.pipe(
    map((data) => data.initialLoadError)
  );
  readonly removeAlertLoading$ = this.getState$.pipe(
    map((data) => data.removeAlertLoading)
  );
  readonly removeAlertError$ = this.getState$.pipe(
    map((data) => data.removeAlertError)
  );
  readonly updateTimespanQuantityLoading$ = this.getState$.pipe(
    map((data) => data.updateTimespanQuantityLoading)
  );
  readonly updateTimespanQuantityError$ = this.getState$.pipe(
    map((data) => data.updateTimespanQuantityError)
  );
  readonly deleteRecipientLoading$ = this.getState$.pipe(
    map((data) => data.deleteRecipientLoading)
  );
  readonly deleteRecipientError$ = this.getState$.pipe(
    map((data) => data.deleteRecipientError)
  );

  constructor(
    private organizationsService: OrganizationsService,
    private projectSettingsService: ProjectSettingsService,
    private projectAlertsAPIService: ProjectAlertsAPIService,
    private snackBar: MatSnackBar
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
    this.setDeleteAlertLoading(pk);
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
                  this.snackBar.open(`Success: Your alert has been deleted`);
                })
              );
          }
          return EMPTY;
        }),
        catchError((err: HttpErrorResponse) => {
          this.setDeleteAlertError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  updateTimespanQuantity(
    newTimespan: number,
    newQuantity: number,
    pk: number,
    recipients: AlertRecipient[]
  ) {
    this.setUpdateTimespanQuantityLoading(pk);
    const data: NewProjectAlert = {
      timespan_minutes: newTimespan,
      quantity: newQuantity,
      alertRecipients: recipients,
    };
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
    ])
      .pipe(
        mergeMap(([orgSlug, projectSlug]) => {
          if (orgSlug && projectSlug) {
            return this.projectAlertsAPIService
              .update(pk.toString(), data, orgSlug, projectSlug)
              .pipe(
                tap((resp) => {
                  this.setUpdateTimespanQuantity(resp);
                  this.snackBar.open(`Success: Your alert has been updated`);
                })
              );
          }
          return EMPTY;
        }),
        catchError((err: HttpErrorResponse) => {
          this.setUpdateTimespanQuantityError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  deleteAlertRecipient(recipientToRemove: AlertRecipient, alert: ProjectAlert) {
    this.setDeleteRecipientLoading(recipientToRemove.pk);
    const data = {
      ...alert,
      alertRecipients: alert.alertRecipients.filter(
        (currentRecipient) => currentRecipient.pk !== recipientToRemove.pk
      ),
    };
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.projectSettingsService.activeProjectSlug$,
    ])
      .pipe(
        mergeMap(([orgSlug, projectSlug]) => {
          if (orgSlug && projectSlug) {
            return this.projectAlertsAPIService
              .update(alert.pk.toString(), data, orgSlug, projectSlug)
              .pipe(
                tap((resp) => {
                  this.setUpdateAlertRecipients(resp);
                  this.snackBar.open(
                    `Success: Your recipient has been deleted`
                  );
                })
              );
          }
          return EMPTY;
        }),
        catchError((err: HttpErrorResponse) => {
          this.setDeleteRecipientError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  clearState() {
    this.projectAlertState.next(initialState);
  }

  private setProjectAlertsList(alerts: ProjectAlert[]) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      projectAlerts: alerts,
      initialLoad: true,
      initialLoadError: null,
    });
  }

  private setProjectAlertsListError(err: HttpErrorResponse) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      initialLoad: true,
      initialLoadError: `There was an error loading your alerts. Try refreshing the page.`,
    });
  }

  private setDeleteAlertLoading(pk: number) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      removeAlertLoading: pk,
      removeAlertError: null,
    });
  }

  private setDeleteProjectAlert(pk: number) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      projectAlerts:
        state.projectAlerts?.filter((alert) => alert.pk !== pk) ?? null,
      removeAlertLoading: null,
      removeAlertError: null,
    });
  }

  private setDeleteAlertError(err: HttpErrorResponse) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      removeAlertError: err.message,
      removeAlertLoading: null,
    });
  }

  private setUpdateTimespanQuantity(updatedAlert: ProjectAlert) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      projectAlerts: this.findAndReplaceAlert(
        state.projectAlerts,
        updatedAlert
      ),
      updateTimespanQuantityLoading: null,
      updateTimespanQuantityError: null,
    });
  }

  private setUpdateTimespanQuantityLoading(pk: number) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      updateTimespanQuantityLoading: pk,
      updateTimespanQuantityError: null,
    });
  }

  private setUpdateTimespanQuantityError(err: HttpErrorResponse) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      updateTimespanQuantityLoading: null,
      updateTimespanQuantityError: err.message,
    });
  }

  private setUpdateAlertRecipients(newAlert: ProjectAlert) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      projectAlerts:
        state.projectAlerts?.map((alert) => {
          return { ...alert, alertRecipients: newAlert.alertRecipients };
        }) ?? null,
      deleteRecipientLoading: null,
      deleteRecipientError: null,
    });
  }

  private setDeleteRecipientLoading(pk: number) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      deleteRecipientLoading: pk,
      deleteRecipientError: null,
    });
  }

  private setDeleteRecipientError(err: HttpErrorResponse) {
    const state = this.projectAlertState.getValue();
    this.projectAlertState.next({
      ...state,
      deleteRecipientLoading: null,
      deleteRecipientError: err.message,
    });
  }

  // utility functions
  findAndReplaceAlert(
    currentAlerts: ProjectAlert[] | null,
    newAlert: ProjectAlert
  ): ProjectAlert[] | null {
    const indexToReplace = currentAlerts?.findIndex(
      (alert) => alert.pk === newAlert.pk
    );
    return indexToReplace !== undefined
      ? currentAlerts?.splice(indexToReplace, 1, newAlert) ?? null
      : null;
  }
}

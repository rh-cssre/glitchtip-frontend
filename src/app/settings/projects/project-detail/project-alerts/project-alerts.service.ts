import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, EMPTY } from "rxjs";
import { tap, map, mergeMap, take, catchError } from "rxjs/operators";
import { OrganizationsService } from "../../../../api/organizations/organizations.service";
import { ProjectAlertsAPIService } from "../../../../api/projects/project-alerts/project-alerts.service";
import {
  AlertRecipient,
  ProjectAlert,
} from "../../../../api/projects/project-alerts/project-alerts.interface";
import { ProjectSettingsService } from "../../project-settings.service";
import { HttpErrorResponse } from "@angular/common/http";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";

interface ProjectAlertState {
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

const initialState: ProjectAlertState = {
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
export class ProjectAlertsService extends StatefulService<ProjectAlertState> {
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
  ) {
    super(initialState);
  }

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
    const data: ProjectAlert = {
      pk: pk,
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
    this.clearState();
  }

  private setProjectAlertsList(alerts: ProjectAlert[]) {
    this.setState({
      projectAlerts: alerts,
      initialLoad: true,
      initialLoadError: null,
    });
  }

  private setProjectAlertsListError(err: HttpErrorResponse) {
    this.setState({
      initialLoad: true,
      initialLoadError: `There was an error loading your alerts. Try refreshing the page.`,
    });
  }

  private setDeleteAlertLoading(pk: number) {
    this.setState({
      removeAlertLoading: pk,
      removeAlertError: null,
    });
  }

  private setDeleteProjectAlert(pk: number) {
    const state = this.state.getValue();
    this.setState({
      projectAlerts:
        state.projectAlerts?.filter((alert) => alert.pk !== pk) ?? null,
      removeAlertLoading: null,
      removeAlertError: null,
    });
  }

  private setDeleteAlertError(err: HttpErrorResponse) {
    this.setState({
      removeAlertError: err.message,
      removeAlertLoading: null,
    });
  }

  private setUpdateTimespanQuantity(updatedAlert: ProjectAlert) {
    const state = this.state.getValue();
    this.setState({
      projectAlerts: this.findAndReplaceAlert(
        state.projectAlerts,
        updatedAlert
      ),
      updateTimespanQuantityLoading: null,
      updateTimespanQuantityError: null,
    });
  }

  private setUpdateTimespanQuantityLoading(pk: number) {
    this.setState({
      updateTimespanQuantityLoading: pk,
      updateTimespanQuantityError: null,
    });
  }

  private setUpdateTimespanQuantityError(err: HttpErrorResponse) {
    this.setState({
      updateTimespanQuantityLoading: null,
      updateTimespanQuantityError: err.message,
    });
  }

  private setUpdateAlertRecipients(newAlert: ProjectAlert) {
    const state = this.state.getValue();
    this.setState({
      projectAlerts:
        state.projectAlerts?.map((alert) => {
          return { ...alert, alertRecipients: newAlert.alertRecipients };
        }) ?? null,
      deleteRecipientLoading: null,
      deleteRecipientError: null,
    });
  }

  private setDeleteRecipientLoading(pk: number) {
    this.setState({
      deleteRecipientLoading: pk,
      deleteRecipientError: null,
    });
  }

  private setDeleteRecipientError(err: HttpErrorResponse) {
    this.setState({
      deleteRecipientLoading: null,
      deleteRecipientError: err.message,
    });
  }

  // utility functions
  findAndReplaceAlert(
    currentAlerts: ProjectAlert[] | null,
    newAlert: ProjectAlert
  ): ProjectAlert[] | null {
    const updatedAlert = currentAlerts?.map((alert) => {
      if (alert.pk === newAlert.pk) {
        return {
          ...alert,
          timespan_minutes: newAlert.timespan_minutes,
          quantity: newAlert.quantity,
        };
      } else return alert;
    });
    return updatedAlert !== undefined ? updatedAlert : null;
  }
}

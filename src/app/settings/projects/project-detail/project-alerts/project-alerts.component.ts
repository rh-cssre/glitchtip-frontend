import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  AlertRecipient,
  ProjectAlert,
} from "src/app/api/projects/project-alerts/project-alerts.interface";
import { ProjectAlertsService } from "./project-alerts.service";
import { MatDialog } from "@angular/material/dialog";
import { NewRecipientComponent } from "./new-recipient/new-recipient.component";
import { AlertFormComponent } from "./alert-form/alert-form.component";
import { distinctUntilChanged } from "rxjs";

@Component({
  selector: "gt-project-alerts",
  templateUrl: "./project-alerts.component.html",
  styleUrls: ["./project-alerts.component.scss"],
})
export class ProjectAlertsComponent implements OnInit, OnDestroy {
  @ViewChild("newAlert") newAlertRef?: AlertFormComponent;
  projectAlerts$ = this.alertsService.projectAlerts$;
  newProjectAlertRecipients$ = this.alertsService.newProjectAlertRecipients$;
  initialLoad$ = this.alertsService.initialLoad$;
  initialLoadError$ = this.alertsService.initialLoadError$;
  removeAlertLoading$ = this.alertsService.removeAlertLoading$;
  removeAlertError$ = this.alertsService.removeAlertError$;
  updatePropertiesLoading$ = this.alertsService.updatePropertiesLoading$;
  updatePropertiesError$ = this.alertsService.updatePropertiesError$;
  deleteRecipientLoading$ = this.alertsService.deleteRecipientLoading$;
  deleteRecipientError$ = this.alertsService.deleteRecipientError$;
  newAlertOpen$ = this.alertsService.newAlertOpen$;
  recipientDialogOpen$ = this.alertsService.recipientDialogOpen$;
  newAlertLoading$ = this.alertsService.newAlertLoading$;
  newAlertError$ = this.alertsService.newAlertError$;

  constructor(
    private alertsService: ProjectAlertsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.alertsService.listProjectAlerts();

    this.recipientDialogOpen$
      .pipe(distinctUntilChanged())
      .subscribe((resp) => resp && this.dialog.open(NewRecipientComponent));
  }

  ngOnDestroy() {
    this.alertsService.clearState();
  }

  openNewAlert() {
    this.alertsService.openNewAlert();
  }

  removeNewAlertRecipient(url: string) {
    this.alertsService.removeNewAlertRecipient(url);
  }

  openUpdateRecipientDialog(alert: ProjectAlert) {
    this.alertsService.openUpdateRecipientDialog(alert);
  }

  openCreateRecipientDialog() {
    this.alertsService.openCreateRecipientDialog();
  }

  closeNewAlert() {
    this.alertsService.closeNewAlert();
  }

  removeAlert(pk: number) {
    if (window.confirm("Are you sure you want to remove this notification?")) {
      this.alertsService.deleteProjectAlert(pk);
    }
  }

  updateProperties(
    event: {
      timespan_minutes: number;
      quantity: number;
      uptime: boolean;
    },
    alert: ProjectAlert
  ): void {
    if (alert.pk) {
      this.alertsService.updateAlertProperties(
        event.timespan_minutes,
        event.quantity,
        event.uptime,
        alert.pk,
        alert.alertRecipients
      );
    }
  }

  removeAlertRecipient(recipient: AlertRecipient, alert: ProjectAlert) {
    this.alertsService.deleteAlertRecipient(recipient, alert);
  }

  newAlertProperties(event: {
    timespan_minutes: number;
    quantity: number;
    uptime: boolean;
  }) {
    this.alertsService.createNewAlert(event);
  }

  submitCreateAlert() {
    this.newAlertRef?.onSubmit();
  }
}

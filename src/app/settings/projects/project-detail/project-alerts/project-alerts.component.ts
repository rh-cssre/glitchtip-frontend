import { Component, OnInit, ViewChild, inject, input } from "@angular/core";
import { ProjectAlertsService } from "./project-alerts.service";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AlertFormComponent } from "./alert-form/alert-form.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoadingButtonComponent } from "../../../../shared/loading-button/loading-button.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { components } from "src/app/api/api-schema";
import { NewRecipientComponent } from "./new-recipient/new-recipient.component";

type ProjectAlert = components["schemas"]["ProjectAlertSchema"];
type AlertRecipient = components["schemas"]["AlertRecipientSchema"];

@Component({
  selector: "gt-project-alerts",
  templateUrl: "./project-alerts.component.html",
  styleUrls: ["./project-alerts.component.scss"],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    AlertFormComponent,
    MatIconModule,
    MatTooltipModule,
    LoadingButtonComponent,
    MatProgressSpinnerModule,
  ],
  providers: [ProjectAlertsService],
})
export class ProjectAlertsComponent implements OnInit {
  #service = inject(ProjectAlertsService);
  dialog = inject(MatDialog);
  orgSlug = input.required<string>();
  projectSlug = input.required<string>();

  @ViewChild("newAlert") newAlertRef?: AlertFormComponent;
  projectAlerts = this.#service.projectAlerts;
  newProjectAlertRecipients = this.#service.newProjectAlertRecipients;
  initialLoad = this.#service.initialLoad;
  initialLoadError = this.#service.initialLoadError;
  removeAlertLoading = this.#service.removeAlertLoading;
  removeAlertError = this.#service.removeAlertError;
  updatePropertiesLoading = this.#service.updatePropertiesLoading;
  updatePropertiesError = this.#service.updatePropertiesError;
  deleteRecipientLoading = this.#service.deleteRecipientLoading;
  deleteRecipientError = this.#service.deleteRecipientError;
  newAlertOpen = this.#service.newAlertOpen;
  recipientDialogOpen = this.#service.recipientDialogOpen;
  newAlertLoading = this.#service.newAlertLoading;
  newAlertError = this.#service.newAlertError;

  ngOnInit(): void {
    this.#service.setParams(this.orgSlug(), this.projectSlug());
  }

  openNewAlert() {
    this.#service.openNewAlert();
  }

  removeNewAlertRecipient(url: string) {
    this.#service.removeNewAlertRecipient(url);
  }

  openUpdateRecipientDialog(alert: ProjectAlert) {
    this.#service.openUpdateRecipientDialog(alert);
    const dialogRef = this.dialog.open(NewRecipientComponent, {
      data: { emailSelected: this.#service.emailSelected() },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.#service.addAlertRecipient(result);
      }
    });
  }

  openCreateRecipientDialog() {
    this.#service.openCreateRecipientDialog();
    const dialogRef = this.dialog.open(NewRecipientComponent, {
      data: { emailSelected: this.#service.emailSelected() },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.#service.addAlertRecipient(result);
      }
    });
  }

  closeNewAlert() {
    this.#service.closeNewAlert();
  }

  removeAlert(id: number) {
    if (window.confirm("Are you sure you want to remove this notification?")) {
      this.#service.deleteProjectAlert(id);
    }
  }

  updateProperties(
    event: {
      timespanMinutes: number;
      quantity: number;
      uptime: boolean;
    },
    alert: ProjectAlert,
  ): void {
    if (alert.id) {
      this.#service.updateAlertProperties(
        event.timespanMinutes,
        event.quantity,
        event.uptime,
        alert.id,
        alert.alertRecipients,
      );
    }
  }

  removeAlertRecipient(recipient: AlertRecipient, alert: ProjectAlert) {
    this.#service.deleteAlertRecipient(recipient, alert);
  }

  newAlertProperties(event: {
    timespanMinutes: number;
    quantity: number;
    uptime: boolean;
  }) {
    this.#service.createNewAlert(event);
  }

  submitCreateAlert() {
    this.newAlertRef?.onSubmit();
  }
}

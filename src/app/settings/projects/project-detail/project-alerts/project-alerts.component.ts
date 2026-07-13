import {
  Component,
  OnInit,
  ViewChild,
  inject,
  input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { OrganizationsService } from "src/app/api/organizations.service";
import {
  NewAlertRecipient,
  ProjectAlertsService,
} from "./project-alerts.service";
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
import { RecipientType } from "src/app/api/projects/project-alerts/project-alerts.interface";

type ProjectAlert = components["schemas"]["ProjectAlertSchema"];
type AlertRecipient = components["schemas"]["AlertRecipientSchema"];

export const iconXrefMapping: Partial<Record<RecipientType, string>> = {
  feishu: "webhook",
  teams: "microsoft",
};
export function resolveRecipientIcon(type: RecipientType): string {
  return iconXrefMapping[type] ?? type;
}

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
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ProjectAlertsService],
})
export class ProjectAlertsComponent implements OnInit {
  #service = inject(ProjectAlertsService);
  organizationsService = inject(OrganizationsService);
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
  testAlertLoading = this.#service.testAlertLoading;
  newAlertOpen = this.#service.newAlertOpen;
  recipientDialogOpen = this.#service.recipientDialogOpen;
  newAlertLoading = this.#service.newAlertLoading;
  newAlertError = this.#service.newAlertError;
  accessProjectWrite = this.organizationsService.accessProjectWrite;
  resolveRecipientIcon = resolveRecipientIcon;

  ngOnInit(): void {
    this.#service.setParams(this.orgSlug(), this.projectSlug());
  }

  openNewAlert() {
    this.#service.openNewAlert();
  }

  removeNewAlertRecipient(url: string) {
    this.#service.removeNewAlertRecipient(url);
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

  openEditNewRecipientDialog(recipient: NewAlertRecipient, index: number) {
    const dialogRef = this.dialog.open(NewRecipientComponent, {
      data: {
        emailSelected: this.#service.emailSelected(),
        editRecipient: recipient,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.#service.editNewAlertRecipient(index, result);
      }
    });
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

  testRecipient(alertId: number, recipientId: number) {
    this.#service.testRecipient(alertId, recipientId);
  }

  openEditRecipientDialog(recipient: AlertRecipient, alert: ProjectAlert) {
    this.#service.openUpdateRecipientDialog(alert);
    const dialogRef = this.dialog.open(NewRecipientComponent, {
      data: {
        emailSelected: this.#service.emailSelected(),
        editRecipient: recipient,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.#service.editAlertRecipient(result, recipient, alert);
      }
    });
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

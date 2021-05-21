import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import {
  AlertRecipient,
  ProjectAlert,
} from "src/app/api/projects/project-alerts/project-alerts.interface";
import { ProjectAlertsService } from "./project-alerts.service";

@Component({
  selector: "app-project-alerts",
  templateUrl: "./project-alerts.component.html",
  styleUrls: ["./project-alerts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAlertsComponent implements OnInit, OnDestroy {
  projectAlerts$ = this.alertsService.projectAlert$;
  initialLoad$ = this.alertsService.initialLoad$;
  initialLoadError$ = this.alertsService.initialLoadError$;
  removeAlertLoading$ = this.alertsService.removeAlertLoading$;
  removeAlertError$ = this.alertsService.removeAlertError$;
  updateTimespanQuantityLoading$ =
    this.alertsService.updateTimespanQuantityLoading$;
  updateTimespanQuantityError$ =
    this.alertsService.updateTimespanQuantityError$;
  deleteRecipientLoading$ = this.alertsService.deleteRecipientLoading$;
  deleteRecipientError$ = this.alertsService.deleteRecipientError$;

  constructor(private alertsService: ProjectAlertsService) {}

  ngOnInit(): void {
    this.alertsService.listProjectAlerts();
  }

  ngOnDestroy() {
    this.alertsService.clearState();
  }

  newAlert() {
    // open dialog
    // show alert form
  }

  removeAlert(pk: number) {
    this.alertsService.deleteProjectAlert(pk);
  }

  updateTimespanQuantity(
    event: {
      timespan_minutes: number;
      quantity: number;
      pk: number;
    },
    recipients: AlertRecipient[]
  ) {
    this.alertsService.updateTimespanQuantity(
      event.timespan_minutes,
      event.quantity,
      event.pk,
      recipients
    );
  }

  removeAlertRecipient(recipient: AlertRecipient, alert: ProjectAlert) {
    this.alertsService.deleteAlertRecipient(recipient, alert);
  }

  addAlertRecipient() {
    // open dialog
  }
}

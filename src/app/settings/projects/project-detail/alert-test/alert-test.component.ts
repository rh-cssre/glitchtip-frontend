import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { ProjectAlertsService } from "../project-alerts/project-alerts.service";

@Component({
  selector: "app-alert-test",
  templateUrl: "./alert-test.component.html",
  styleUrls: ["./alert-test.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertTestComponent implements OnInit {
  projectAlerts$ = this.alertsService.projectAlert$;

  alertsForm = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private alertsService: ProjectAlertsService
  ) {}

  ngOnInit() {
    this.alertsForm = this.fb.group({
      alerts: this.fb.array([]),
    });

    this.projectAlerts$.subscribe((alerts) => {
      alerts?.map((alert) => {
        this.fb.group({
          timespan: alert.timespan_minutes,
          quantity: alert.quantity,
        });
      });
    });
  }

  alerts(): FormArray {
    return this.alertsForm.get("alerts") as FormArray;
  }

  newAlert(): FormGroup {
    return this.fb.group({
      timespan: "",
      quantity: "",
      skills: this.fb.array([]),
    });
  }

  addAlert() {
    this.alerts().push(this.newAlert());
  }

  removeAlert(alertIndex: number) {
    this.alerts().removeAt(alertIndex);
  }

  alertRecipients(alertIndex: number): FormArray {
    return this.alerts().at(alertIndex).get("skills") as FormArray;
  }

  newRecipient(): FormGroup {
    return this.fb.group({
      type: "",
      url: "",
    });
  }

  addAlertRecipients(alertIndex: number) {
    this.alertRecipients(alertIndex).push(this.newRecipient());
  }

  removeAlertRecipient(alertIndex: number, recipientIndex: number) {
    this.alertRecipients(alertIndex).removeAt(recipientIndex);
  }

  onSubmit() {
    console.log(this.alertsForm.value);
  }
}

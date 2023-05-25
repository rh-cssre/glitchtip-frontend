import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { UptimeService } from "../uptime.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { intRegex, urlRegex } from "src/app/shared/validators";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { MonitorType } from "../uptime.interfaces";
import { CommonModule } from "@angular/common";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: "gt-new-monitor",
  templateUrl: "./new-monitor.component.html",
  styleUrls: ["./new-monitor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LoadingButtonComponent,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class NewMonitorComponent implements OnInit {
  error$ = this.uptimeService.error$;
  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  loading$ = this.uptimeService.createLoading$;
  totalEventsAllowed$ = this.subscriptionsService.totalEventsAllowed$;

  typeChoices: MonitorType[] = ["Ping", "GET", "POST", "Heartbeat"];

  newMonitorForm = new UntypedFormGroup({
    monitorType: new UntypedFormControl("Ping", [Validators.required]),
    name: new UntypedFormControl("", [
      Validators.required,
      Validators.maxLength(200),
    ]),
    url: new UntypedFormControl("https://", [
      Validators.pattern(urlRegex),
      Validators.required,
      Validators.maxLength(2000),
    ]),
    expectedStatus: new UntypedFormControl({ value: 200, disabled: true }, [
      Validators.required,
      Validators.min(100),
      Validators.pattern(intRegex),
    ]),
    interval: new UntypedFormControl("60", [
      Validators.required,
      Validators.min(1),
      Validators.max(86399),
    ]),
    timeout: new UntypedFormControl(null, [
      Validators.min(1),
      Validators.max(60),
      Validators.pattern(intRegex),
    ]),
    project: new UntypedFormControl(null),
  });

  formName = this.newMonitorForm.get("name") as UntypedFormControl;
  formMonitorType = this.newMonitorForm.get(
    "monitorType"
  ) as UntypedFormControl;
  formUrl = this.newMonitorForm.get("url") as UntypedFormControl;
  formExpectedStatus = this.newMonitorForm.get(
    "expectedStatus"
  ) as UntypedFormControl;
  formInterval = this.newMonitorForm.get("interval") as UntypedFormControl;
  formTimeout = this.newMonitorForm.get("timeout") as UntypedFormControl;

  intervalPerMonth = 2592000 / this.formInterval.value;

  constructor(
    private organizationsService: OrganizationsService,
    private subscriptionsService: SubscriptionsService,
    private uptimeService: UptimeService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.uptimeService.callSubscriptionDetails();
    this.formInterval.valueChanges.subscribe((interval) => {
      this.intervalPerMonth = Math.floor(2592000 / interval);
    });
  }

  updateRequiredFields() {
    if (this.formMonitorType.value === "Heartbeat") {
      this.formUrl.disable();
      this.formExpectedStatus.disable();
      this.formTimeout.disable();
    } else if (this.formMonitorType.value === "Ping") {
      this.formUrl.enable();
      this.formExpectedStatus.disable();
      this.formTimeout.enable();
    } else {
      this.formUrl.enable();
      this.formExpectedStatus.enable();
      this.formTimeout.enable();
    }
  }

  openEventInfoDialog() {
    this.dialog.open(EventInfoComponent, {
      maxWidth: "300px",
    });
  }

  onSubmit() {
    if (this.newMonitorForm.valid) {
      this.uptimeService.createMonitor({
        ...this.newMonitorForm.value,
        expectedStatus: this.formExpectedStatus.enabled
          ? this.formExpectedStatus.value
          : null,
        url: this.formUrl.enabled ? this.formUrl.value : "",
      });
    }
  }
}

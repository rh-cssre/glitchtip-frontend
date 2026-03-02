import {
  Component,
  OnInit,
  input,
  output,
  inject,
  signal,
} from "@angular/core";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { DecimalPipe, NgTemplateOutlet } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MonitorInput, MonitorType } from "../uptime.interfaces";
import { intRegex, urlRegex } from "src/app/shared/validators";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { MonitorService } from "../monitor.service";
import { ServerError } from "src/app/shared/django.interfaces";
import { OrganizationsService } from "src/app/api/organizations.service";
import { components } from "src/app/api/api-schema";

type MonitorDetail = components["schemas"]["MonitorDetailSchema"];

const defaultExpectedStatus = 200;
const defaultInterval = 60;

// returns a pattern error to simplify error checking in template
export function portUrlValidator(
  control: AbstractControl<string>,
): ValidationErrors | null {
  if (control.value.startsWith("https:")) {
    return { pattern: true };
  }
  return null;
}

const standardUrlValidators = [
  Validators.pattern(urlRegex),
  Validators.required,
  Validators.maxLength(2000),
];

const portUrlValidators = [
  Validators.required,
  Validators.maxLength(2000),
  portUrlValidator,
];

@Component({
  selector: "gt-monitor-form",
  templateUrl: "./monitor-form.component.html",
  styleUrls: ["./monitor-form.component.scss"],
  imports: [
    DecimalPipe,
    NgTemplateOutlet,
    ReactiveFormsModule,
    RouterModule,
    LoadingButtonComponent,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatOptionModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
  ],
})
export class MonitorFormComponent implements OnInit {
  private organizationsService = inject(OrganizationsService);
  private subscriptionService = inject(SubscriptionService);
  private monitorService = inject(MonitorService);
  dialog = inject(MatDialog);

  readonly monitorSettings = input<MonitorDetail>();
  readonly formError = input.required<ServerError | null>();
  readonly loading = input.required<boolean | null>();

  readonly formSubmitted = output<MonitorInput>();

  orgProjects = this.organizationsService.activeOrganizationProjects;
  totalEventsAllowed = this.subscriptionService.totalEventsAllowed;

  intervalPerMonth = signal<number | null>(null);

  typeChoices: MonitorType[] = ["Ping", "GET", "POST", "Heartbeat", "TCP Port"];

  formMonitorType = new FormControl<MonitorType>("Ping", {
    nonNullable: true,
    validators: [Validators.required],
  });

  formName = new FormControl<string>("", {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(200)],
  });

  formUrl = new FormControl<string>("https://", {
    nonNullable: true,
    validators: standardUrlValidators,
  });

  formExpectedStatus = new FormControl<number>(defaultExpectedStatus, [
    Validators.required,
    Validators.min(100),
    Validators.pattern(intRegex),
  ]);

  formExpectedBody = new FormControl("");

  formInterval = new FormControl<number>(defaultInterval, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), Validators.max(32767)],
  });

  formTimeout = new FormControl<number | null>(null, [
    Validators.min(1),
    Validators.max(60),
    Validators.pattern(intRegex),
  ]);

  formProject = new FormControl<string | null>(null);

  monitorForm = new FormGroup({
    monitorType: this.formMonitorType,
    name: this.formName,
    url: this.formUrl,
    expectedStatus: this.formExpectedStatus,
    expectedBody: this.formExpectedBody,
    interval: this.formInterval,
    timeout: this.formTimeout,
    project: this.formProject,
  });

  ngOnInit() {
    this.monitorService.callSubscriptionDetails();
    const initialInterval = this.monitorSettings()?.interval ?? defaultInterval;
    this.intervalPerMonth.set(Math.floor(2592000 / initialInterval));

    this.formInterval.valueChanges.subscribe((interval) => {
      this.intervalPerMonth.set(Math.floor(2592000 / interval));
    });

    const monitorSettings = this.monitorSettings();
    if (monitorSettings) {
      this.formName.patchValue(monitorSettings.name);
      this.formMonitorType.patchValue(monitorSettings.monitorType);
      this.formUrl.patchValue(monitorSettings.url ? monitorSettings.url : "");
      this.formExpectedStatus.patchValue(
        monitorSettings.expectedStatus
          ? monitorSettings.expectedStatus
          : defaultExpectedStatus,
      );
      this.formExpectedBody.patchValue(monitorSettings.expectedBody!);
      this.formInterval.patchValue(monitorSettings.interval);
      this.formTimeout.patchValue(monitorSettings.timeout!);
      this.formProject.patchValue(monitorSettings.projectID);
    }

    this.updateRequiredFields();
  }

  updateRequiredFields() {
    this.formUrl.enable();
    this.formUrl.setValidators(standardUrlValidators);
    this.formExpectedStatus.enable();
    this.formExpectedBody.enable();
    this.formTimeout.enable();
    if (this.formMonitorType.value === "Heartbeat") {
      this.formUrl.disable();
      this.formExpectedStatus.disable();
      this.formExpectedBody.disable();
      this.formTimeout.disable();
    } else if (this.formMonitorType.value === "Ping") {
      this.formExpectedStatus.disable();
      this.formExpectedBody.disable();
    } else if (this.formMonitorType.value === "TCP Port") {
      this.formUrl.setValidators(portUrlValidators);
      this.formExpectedStatus.disable();
      this.formExpectedBody.disable();
      if (this.formUrl.value === "https://") {
        this.formUrl.setValue("");
      }
    }
  }

  openEventInfoDialog() {
    this.dialog.open(EventInfoComponent, {
      maxWidth: "300px",
    });
  }

  submit() {
    if (this.monitorForm.valid) {
      this.formSubmitted.emit({
        ...this.monitorForm.value,
        name: this.formName.value!,
        interval: this.formInterval.value,
        monitorType: this.formMonitorType.value!,
        project: this.formProject.value ? this.formProject.value : null,
        expectedStatus: this.formExpectedStatus.enabled
          ? this.formExpectedStatus.value
          : null,
        expectedBody: this.formExpectedBody.value!,
        url: this.formUrl.enabled ? this.formUrl.value : "",
        timeout: this.formTimeout.value,
      });
    }
  }
}

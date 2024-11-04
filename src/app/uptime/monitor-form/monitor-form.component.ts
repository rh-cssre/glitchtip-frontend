import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { map, Observable, of, startWith } from "rxjs";
import { MonitorDetail, MonitorInput, MonitorType } from "../uptime.interfaces";
import { intRegex, urlRegex } from "src/app/shared/validators";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { MonitorService } from "../monitor.service";
import { ServerError } from "src/app/shared/django.interfaces";

const defaultExpectedStatus = 200;
const defaultInterval = 60;

// returns a pattern error to simplify error checking in template
export function portUrlValidator(
  control: AbstractControl<string>
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
  standalone: true,
  selector: "gt-monitor-form",
  templateUrl: "./monitor-form.component.html",
  styleUrls: ["./monitor-form.component.scss"],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    EventInfoComponent,
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
  @Input() monitorSettings?: MonitorDetail;
  @Input({ required: true }) formError!: ServerError | null;
  @Input({ required: true }) loading!: boolean | null;

  @Output() formSubmitted = new EventEmitter<MonitorInput>();

  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  totalEventsAllowed$ = this.subscriptionsService.totalEventsAllowed$;

  intervalPerMonth$: Observable<number | null> = of(null);

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

  formProject = new FormControl<number | null>(null);

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

  constructor(
    private organizationsService: OrganizationsService,
    private subscriptionsService: SubscriptionsService,
    private monitorService: MonitorService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.monitorService.callSubscriptionDetails();
    this.intervalPerMonth$ =
      this.monitorForm.controls.interval.valueChanges.pipe(
        startWith(this.monitorSettings?.interval ?? defaultInterval),
        map((interval) => Math.floor(2592000 / interval))
      );

    if (this.monitorSettings) {
      this.formName.patchValue(this.monitorSettings.name);
      this.formMonitorType.patchValue(this.monitorSettings.monitorType);
      this.formUrl.patchValue(
        this.monitorSettings.url ? this.monitorSettings.url : ""
      );
      this.formExpectedStatus.patchValue(
        this.monitorSettings.expectedStatus
          ? this.monitorSettings.expectedStatus
          : defaultExpectedStatus
      );
      this.formExpectedBody.patchValue(this.monitorSettings.expectedBody);
      this.formInterval.patchValue(this.monitorSettings.interval);
      this.formTimeout.patchValue(this.monitorSettings.timeout);
      this.formProject.patchValue(this.monitorSettings.project);
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

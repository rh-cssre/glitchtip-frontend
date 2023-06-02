import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
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
import { MonitorDetail, MonitorInput, MonitorType } from "../uptime.interfaces";
import { intRegex, urlRegex } from "src/app/shared/validators";
import { timedeltaToMS } from "src/app/shared/shared.utils";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";

const defaultExpectedStatus = 200;
const defaultUrl = "https://";

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
  @Input() monitor?: MonitorDetail;
  @Input({ required: true }) formError!: string | null;
  @Input({ required: true }) loading!: boolean | null;

  @Output() formSubmitted = new EventEmitter<MonitorInput>();

  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  totalEventsAllowed$ = this.subscriptionsService.totalEventsAllowed$;

  intervalPerMonth: number | null = null;

  typeChoices: MonitorType[] = ["Ping", "GET", "POST", "Heartbeat"];

  monitorForm = new FormGroup({
    monitorType: new FormControl<MonitorType>("Ping", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    url: new FormControl<string>(defaultUrl, {
      nonNullable: true,
      validators: [
        Validators.pattern(urlRegex),
        Validators.required,
        Validators.maxLength(2000),
      ],
    }),
    expectedStatus: new FormControl<number>(defaultExpectedStatus, [
      Validators.required,
      Validators.min(100),
      Validators.pattern(intRegex),
    ]),
    interval: new FormControl<number>(60, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(1),
        Validators.max(86399),
      ],
    }),
    timeout: new FormControl<number | null>(null, [
      Validators.min(1),
      Validators.max(60),
      Validators.pattern(intRegex),
    ]),
    project: new FormControl<number | null>(null),
  });

  formName = this.monitorForm.get("name") as FormControl;
  formMonitorType = this.monitorForm.get("monitorType") as FormControl;
  formUrl = this.monitorForm.get("url") as FormControl;
  formExpectedStatus = this.monitorForm.get("expectedStatus") as FormControl;
  formInterval = this.monitorForm.get("interval") as FormControl;
  formProject = this.monitorForm.get("project") as FormControl;
  formTimeout = this.monitorForm.get("timeout") as FormControl;

  constructor(
    private organizationsService: OrganizationsService,
    private subscriptionsService: SubscriptionsService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.monitor) {
      this.formName.patchValue(this.monitor.name);
      this.formMonitorType.patchValue(this.monitor.monitorType);
      this.formUrl.patchValue(this.monitor.url ? this.monitor.url : defaultUrl);
      this.formExpectedStatus.patchValue(
        this.monitor.expectedStatus
          ? this.monitor.expectedStatus
          : defaultExpectedStatus
      );
      this.formInterval.patchValue(
        Math.round(timedeltaToMS(this.monitor.interval) / 1000)
      );
      this.formTimeout.patchValue(this.monitor.timeout);
      this.formProject.patchValue(this.monitor.project);

      if (this.monitor.monitorType === "Heartbeat") {
        this.formUrl.disable();
        this.formExpectedStatus.disable();
        this.formTimeout.disable();
      } else if (this.monitor.monitorType === "Ping") {
        this.formExpectedStatus.disable();
      }
    }

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

  submit() {
    if (this.monitorForm.valid) {
      this.formSubmitted.emit({
        ...this.monitorForm.value,
        name: this.monitorForm.controls.name.value!,
        interval: this.monitorForm.controls.interval.value!.toString(),
        expectedStatus: this.monitorForm.controls.expectedStatus.enabled
          ? this.monitorForm.controls.expectedStatus.value
          : null,
        monitorType: this.monitorForm.controls.monitorType.value!,
        url: this.monitorForm.value.url ? this.monitorForm.value.url : "",
      });
    }
  }
}

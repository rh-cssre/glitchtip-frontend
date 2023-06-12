import { AsyncPipe, DecimalPipe, NgIf, NgFor } from "@angular/common";
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
import { map, Observable, of, startWith } from "rxjs";
import { MonitorDetail, MonitorInput, MonitorType } from "../uptime.interfaces";
import { intRegex, urlRegex } from "src/app/shared/validators";
import { timedeltaToMS } from "src/app/shared/shared.utils";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { MonitorService } from "../monitor.service";

const defaultExpectedStatus = 200;
const defaultInterval = 60;
const defaultUrl = "https://";

@Component({
  standalone: true,
  selector: "gt-monitor-form",
  templateUrl: "./monitor-form.component.html",
  styleUrls: ["./monitor-form.component.scss"],
  imports: [
    AsyncPipe,
    DecimalPipe,
    NgIf,
    NgFor,
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
  @Input({ required: true }) formError!: string | null;
  @Input({ required: true }) loading!: boolean | null;

  @Output() formSubmitted = new EventEmitter<MonitorInput>();

  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  totalEventsAllowed$ = this.subscriptionsService.totalEventsAllowed$;

  intervalPerMonth$: Observable<number | null> = of(null);

  typeChoices: MonitorType[] = ["Ping", "GET", "POST", "Heartbeat"];

  formMonitorType = new FormControl<MonitorType>("Ping", {
    nonNullable: true,
    validators: [Validators.required],
  });

  formName = new FormControl<string>("", {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(200)],
  });

  formUrl = new FormControl<string>(defaultUrl, {
    nonNullable: true,
    validators: [
      Validators.pattern(urlRegex),
      Validators.required,
      Validators.maxLength(2000),
    ],
  });

  formExpectedStatus = new FormControl<number>(defaultExpectedStatus, [
    Validators.required,
    Validators.min(100),
    Validators.pattern(intRegex),
  ]);

  formInterval = new FormControl<number>(defaultInterval, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), Validators.max(86399)],
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
        startWith(
          this.monitorSettings
            ? Math.round(timedeltaToMS(this.monitorSettings.interval) / 1000)
            : defaultInterval
        ),
        map((interval) => Math.floor(2592000 / interval))
      );

    if (this.monitorSettings) {
      this.formName.patchValue(this.monitorSettings.name);
      this.formMonitorType.patchValue(this.monitorSettings.monitorType);
      this.formUrl.patchValue(
        this.monitorSettings.url ? this.monitorSettings.url : defaultUrl
      );
      this.formExpectedStatus.patchValue(
        this.monitorSettings.expectedStatus
          ? this.monitorSettings.expectedStatus
          : defaultExpectedStatus
      );
      this.formInterval.patchValue(
        Math.round(timedeltaToMS(this.monitorSettings.interval) / 1000)
      );
      this.formTimeout.patchValue(this.monitorSettings.timeout);
      this.formProject.patchValue(this.monitorSettings.project);

      if (this.monitorSettings.monitorType === "Heartbeat") {
        this.formUrl.disable();
        this.formExpectedStatus.disable();
        this.formTimeout.disable();
      } else if (this.monitorSettings.monitorType === "Ping") {
        this.formExpectedStatus.disable();
      }
    }
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
        name: this.formName.value!,
        interval: this.formInterval.value!.toString(),
        monitorType: this.formMonitorType.value!,
        expectedStatus: this.formExpectedStatus.enabled
          ? this.formExpectedStatus.value
          : null,
        url: this.formUrl.enabled ? this.formUrl.value : "",
      });
    }
  }
}

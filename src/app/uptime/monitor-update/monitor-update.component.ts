import { Component, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { tap, filter, first, take } from "rxjs/operators";
import { combineLatest, lastValueFrom } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { UptimeService, UptimeState } from "../uptime.service";
import { intRegex, urlRegex } from "src/app/shared/validators";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { MonitorType } from "../uptime.interfaces";
import { timedeltaToMS } from "src/app/shared/shared.utils";
import { StatefulBaseComponent } from "src/app/shared/stateful-service/stateful-base.component";
import { CommonModule } from "@angular/common";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

const defaultExpectedStatus = 200;
const defaultUrl = "https://";

@Component({
  standalone: true,
  selector: "gt-monitor-update",
  templateUrl: "./monitor-update.component.html",
  styleUrls: ["./monitor-update.component.scss"],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
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
export class MonitorUpdateComponent
  extends StatefulBaseComponent<UptimeState, UptimeService>
  implements OnInit
{
  monitor$ = this.service.activeMonitor$;
  loading$ = this.service.editLoading$;
  error$ = this.service.error$;
  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  deleteLoading$ = this.service.deleteLoading$;
  totalEventsAllowed$ = this.subscriptionsService.totalEventsAllowed$;
  intervalPerMonth: number | null = null;

  typeChoices: MonitorType[] = ["Ping", "GET", "POST", "Heartbeat"];

  monitorEditForm = new UntypedFormGroup({
    monitorType: new UntypedFormControl("Ping", [Validators.required]),
    name: new UntypedFormControl("", [
      Validators.required,
      Validators.maxLength(200),
    ]),
    url: new UntypedFormControl(defaultUrl, [
      Validators.pattern(urlRegex),
      Validators.required,
      Validators.maxLength(2000),
    ]),
    expectedStatus: new UntypedFormControl(defaultExpectedStatus, [
      Validators.required,
      Validators.min(100),
      Validators.pattern(intRegex),
    ]),
    interval: new UntypedFormControl(60, [
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

  formName = this.monitorEditForm.get("name") as UntypedFormControl;
  formMonitorType = this.monitorEditForm.get(
    "monitorType"
  ) as UntypedFormControl;
  formUrl = this.monitorEditForm.get("url") as UntypedFormControl;
  formExpectedStatus = this.monitorEditForm.get(
    "expectedStatus"
  ) as UntypedFormControl;
  formInterval = this.monitorEditForm.get("interval") as UntypedFormControl;
  formProject = this.monitorEditForm.get("project") as UntypedFormControl;
  formTimeout = this.monitorEditForm.get("timeout") as UntypedFormControl;

  constructor(
    protected service: UptimeService,
    protected route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private subscriptionsService: SubscriptionsService,
    public dialog: MatDialog
  ) {
    super(service);
  }

  ngOnInit() {
    lastValueFrom(
      combineLatest([
        this.organizationsService.activeOrganizationSlug$,
        this.route.params,
      ]).pipe(
        filter(([orgSlug, params]) => !!orgSlug && !!params),
        take(1),
        tap(([orgSlug, params]) => {
          const monitorId = params["monitor-id"];
          if (orgSlug && monitorId) {
            this.service.retrieveMonitorDetails(orgSlug, monitorId);
            this.service.callSubscriptionDetails();
          }
        })
      )
    );

    this.formInterval.valueChanges.subscribe((interval) => {
      this.intervalPerMonth = Math.floor(2592000 / interval);
    });

    this.monitor$
      .pipe(
        filter((data) => !!data),
        first(),
        tap((data) => {
          this.formName.patchValue(data!.name);
          this.formMonitorType.patchValue(data!.monitorType);
          this.formUrl.patchValue(data!.url ? data!.url : defaultUrl);
          this.formExpectedStatus.patchValue(
            data!.expectedStatus ? data!.expectedStatus : defaultExpectedStatus
          );
          this.formInterval.patchValue(
            Math.round(timedeltaToMS(data!.interval) / 1000)
          );
          this.formTimeout.patchValue(data!.timeout);
          this.formProject.patchValue(data!.project);

          if (data!.monitorType === "Heartbeat") {
            this.formUrl.disable();
            this.formExpectedStatus.disable();
            this.formTimeout.disable();
          } else if (data!.monitorType === "Ping") {
            this.formExpectedStatus.disable();
          }
        })
      )
      .subscribe();
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
    if (this.monitorEditForm.valid) {
      this.service.editMonitor({
        ...this.monitorEditForm.value,
        expectedStatus: this.formExpectedStatus.enabled
          ? this.formExpectedStatus.value
          : null,
        url: this.formUrl.enabled ? this.formUrl.value : "",
      });
    }
  }

  deleteMonitor() {
    if (
      window.confirm(
        `Are you sure you want to remove this monitor? You will lose all of its uptime check history.`
      )
    ) {
      this.service.deleteMonitor();
    }
  }
}

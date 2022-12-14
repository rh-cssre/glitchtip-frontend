import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { map } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { UptimeService } from "../uptime.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { numberValidator, urlRegex } from "src/app/shared/validators";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { MonitorType } from "../uptime.interfaces";

const defaultUrlValidators = [
  Validators.pattern(urlRegex),
  Validators.required,
  Validators.maxLength(2000),
];

@Component({
  selector: "gt-new-monitor",
  templateUrl: "./new-monitor.component.html",
  styleUrls: ["./new-monitor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewMonitorComponent implements OnInit {
  error$ = this.uptimeService.error$;
  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  loading$ = this.uptimeService.createLoading$;
  totalEventsAllowed$ = this.subscriptionsService.subscription$.pipe(
    map((subscription) =>
      subscription && subscription.plan?.product.metadata
        ? parseInt(subscription.plan?.product.metadata.events, 10)
        : null
    )
  );

  typeChoices: MonitorType[] = ["Ping", "GET", "POST", "Heartbeat"];

  newMonitorForm = new UntypedFormGroup({
    monitorType: new UntypedFormControl("Ping", [Validators.required]),
    name: new UntypedFormControl("", [Validators.required, Validators.maxLength(200)]),
    url: new UntypedFormControl("https://", defaultUrlValidators),
    expectedStatus: new UntypedFormControl(200, [
      Validators.required,
      Validators.min(100),
      numberValidator,
    ]),
    interval: new UntypedFormControl("60", [
      Validators.required,
      Validators.min(60),
      Validators.max(86399),
    ]),
    project: new UntypedFormControl(null),
  });

  formName = this.newMonitorForm.get("name") as UntypedFormControl;
  formMonitorType = this.newMonitorForm.get("monitorType") as UntypedFormControl;
  formUrl = this.newMonitorForm.get("url") as UntypedFormControl;
  formExpectedStatus = this.newMonitorForm.get("expectedStatus") as UntypedFormControl;
  formInterval = this.newMonitorForm.get("interval") as UntypedFormControl;

  intervalPerMonth = 2592000 / this.formInterval.value;

  matcher = new LessAnnoyingErrorStateMatcher();

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
      this.formUrl.clearValidators();
      this.formUrl.setValue("");
    } else {
      this.formUrl.setValidators(defaultUrlValidators);
      if (this.formUrl.value === "") {
        this.formUrl.setValue("https://");
      }
    }
  }

  openEventInfoDialog() {
    this.dialog.open(EventInfoComponent, {
      maxWidth: "300px",
    });
  }

  onSubmit() {
    if (this.newMonitorForm.valid) {
      this.uptimeService.createMonitor(this.newMonitorForm.value);
    }
  }
}

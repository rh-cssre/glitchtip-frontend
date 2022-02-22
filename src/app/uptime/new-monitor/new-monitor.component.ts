import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { map } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { UptimeService } from "../uptime.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { numberValidator, urlRegex } from "src/app/shared/validators";
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

  newMonitorForm = new FormGroup({
    monitorType: new FormControl("Ping", [Validators.required]),
    name: new FormControl("", [Validators.required, Validators.maxLength(200)]),
    url: new FormControl("https://", defaultUrlValidators),
    expectedStatus: new FormControl(200, [
      Validators.required,
      Validators.min(100),
      numberValidator,
    ]),
    interval: new FormControl("60", [
      Validators.required,
      Validators.min(60),
      Validators.max(86399),
    ]),
    project: new FormControl(null),
  });

  formName = this.newMonitorForm.get("name") as FormControl;
  formMonitorType = this.newMonitorForm.get("monitorType") as FormControl;
  formUrl = this.newMonitorForm.get("url") as FormControl;
  formExpectedStatus = this.newMonitorForm.get("expectedStatus") as FormControl;
  formInterval = this.newMonitorForm.get("interval") as FormControl;

  intervalPerMonth = 2592000 / this.formInterval.value 

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private organizationsService: OrganizationsService,
    private subscriptionsService: SubscriptionsService,
    private uptimeService: UptimeService
  ) {}

  ngOnInit(): void {
    this.uptimeService.callSubscriptionDetails()
  }

  updateIntervalPerMonth() {
    this.intervalPerMonth = Math.floor(2592000 / this.formInterval.value) 
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

  onSubmit() {
    if (this.newMonitorForm.valid) {
      this.uptimeService.createMonitor(this.newMonitorForm.value);
    }
  }
}

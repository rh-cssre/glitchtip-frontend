import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { tap, filter, first, take, map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { UptimeService } from "../uptime.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { urlRegex, numberValidator } from "src/app/shared/validators";
import { MonitorType } from "../uptime.interfaces";

const defaultUrlValidators = [
  Validators.pattern(urlRegex),
  Validators.required,
  Validators.maxLength(2000),
];

@Component({
  selector: "gt-monitor-update",
  templateUrl: "./monitor-update.component.html",
  styleUrls: ["./monitor-update.component.scss"],
})
export class MonitorUpdateComponent implements OnInit, OnDestroy {
  monitor$ = this.uptimeService.activeMonitor$;
  loading$ = this.uptimeService.editLoading$;
  error$ = this.uptimeService.error$;
  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  deleteLoading$ = this.uptimeService.deleteLoading$;

  totalEventsAllowed$ = this.subscriptionsService.subscription$.pipe(
    map((subscription) =>
      subscription && subscription.plan?.product.metadata
        ? parseInt(subscription.plan.product.metadata.events, 10)
        : null
    )
  );

  intervalPerMonth: number | null = null;

  typeChoices: MonitorType[] = ["Ping", "GET", "POST", "Heartbeat"];

  monitorEditForm = new FormGroup({
    monitorType: new FormControl("Ping", [Validators.required]),
    name: new FormControl("", [Validators.required, Validators.maxLength(200)]),
    url: new FormControl(""),
    expectedStatus: new FormControl(200, [
      Validators.required,
      Validators.min(100),
      numberValidator,
    ]),
    interval: new FormControl(60, [
      Validators.required,
      Validators.min(60),
      Validators.max(86399),
    ]),
    project: new FormControl(null),
  });

  formName = this.monitorEditForm.get("name") as FormControl;
  formMonitorType = this.monitorEditForm.get("monitorType") as FormControl;
  formUrl = this.monitorEditForm.get("url") as FormControl;
  formExpectedStatus = this.monitorEditForm.get(
    "expectedStatus"
  ) as FormControl;
  formInterval = this.monitorEditForm.get("interval") as FormControl;
  formProject = this.monitorEditForm.get("project") as FormControl;

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private uptimeService: UptimeService,
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private subscriptionsService: SubscriptionsService
  ) {}

  ngOnInit() {
    combineLatest([
      this.organizationsService.activeOrganizationSlug$,
      this.route.params,
    ])
      .pipe(
        filter(([orgSlug, params]) => !!orgSlug && !!params),
        take(1),
        tap(([orgSlug, params]) => {
          const monitorId = params["monitor-id"];
          if (orgSlug && monitorId) {
            this.uptimeService.retrieveMonitorDetails(orgSlug, monitorId);
            this.uptimeService.callSubscriptionDetails();
          }
        })
      )
      .toPromise();
    
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
          this.formUrl.patchValue(data!.url);
          this.formExpectedStatus.patchValue(data!.expectedStatus);
          this.formInterval.patchValue(this.toSeconds(data!.interval));
          this.formProject.patchValue(data!.project);

          if (this.formMonitorType.value !== "Heartbeat") {
            this.formUrl.setValidators(defaultUrlValidators);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.uptimeService.clearState();
  }

  toSeconds(interval: string) {
    let seconds = 0;
    if (interval.includes(" ")) {
      seconds += parseInt(interval.split(" ")[0], 10) * 86400;
      interval = interval.split(" ")[1];
    }
    const splitInterval = interval.split(":");
    seconds += parseInt(splitInterval[0], 10) * 3600;
    seconds += parseInt(splitInterval[1], 10) * 60;
    seconds += parseInt(splitInterval[2], 10);

    return seconds;
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
    if (this.monitorEditForm.valid) {
      this.uptimeService.editMonitor(this.monitorEditForm.value);
    }
  }

  deleteMonitor() {
    if (
      window.confirm(
        `Are you sure you want to remove this monitor? You will lose all of its uptime check history.`
      )
    ) {
      this.uptimeService.deleteMonitor();
    }
  }
}

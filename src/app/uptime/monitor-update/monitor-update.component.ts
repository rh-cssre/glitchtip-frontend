import { Component, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { tap, filter, first, take, map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { UptimeService } from "../uptime.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { urlRegex, numberValidator } from "src/app/shared/validators";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { MonitorType } from "../uptime.interfaces";
import { timedeltaToMS } from "src/app/shared/shared.utils";

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

  monitorEditForm = new UntypedFormGroup({
    monitorType: new UntypedFormControl("Ping", [Validators.required]),
    name: new UntypedFormControl("", [Validators.required, Validators.maxLength(200)]),
    url: new UntypedFormControl(""),
    expectedStatus: new UntypedFormControl(200, [
      Validators.required,
      Validators.min(100),
      numberValidator,
    ]),
    interval: new UntypedFormControl(60, [
      Validators.required,
      Validators.min(60),
      Validators.max(86399),
    ]),
    project: new UntypedFormControl(null),
  });

  formName = this.monitorEditForm.get("name") as UntypedFormControl;
  formMonitorType = this.monitorEditForm.get("monitorType") as UntypedFormControl;
  formUrl = this.monitorEditForm.get("url") as UntypedFormControl;
  formExpectedStatus = this.monitorEditForm.get(
    "expectedStatus"
  ) as UntypedFormControl;
  formInterval = this.monitorEditForm.get("interval") as UntypedFormControl;
  formProject = this.monitorEditForm.get("project") as UntypedFormControl;

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private uptimeService: UptimeService,
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private subscriptionsService: SubscriptionsService,
    public dialog: MatDialog
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
          this.formInterval.patchValue(
            Math.round(timedeltaToMS(data!.interval) / 1000)
          );
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

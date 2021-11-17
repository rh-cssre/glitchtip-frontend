import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { catchError, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { UptimeService } from "../uptime.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { urlValidator, numberValidator } from "src/app/shared/validators"


@Component({
  selector: "gt-new-monitor",
  templateUrl: "./new-monitor.component.html",
  styleUrls: ["./new-monitor.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})

export class NewMonitorComponent implements OnInit {

  orgSlug?: string | null;
  error = "";
  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  projEnvironments$ = this.uptimeService.orgEnvironments$
    .pipe(

    );

  typeChoices = [
    'Ping',
    'GET',
    'POST',
    'Heartbeat'
  ]
  loading = false;

  newMonitorForm = new FormGroup({
    monitorType: new FormControl("Ping", [
      Validators.required,
    ]),
    name: new FormControl("", [
      Validators.required,
    ]),
    url: new FormControl("", [
      Validators.required,
      urlValidator
    ]),
    expectedStatus: new FormControl(200, [
      Validators.required,
      Validators.min(100),
      numberValidator
    ]),
    interval: new FormControl("60", [
      Validators.required,
      Validators.min(1),
    ]),
    project: new FormControl(""),
  });

  formName = this.newMonitorForm.get(
    "name"
  ) as FormControl
  formMonitorType = this.newMonitorForm.get(
    "monitorType"
  ) as FormControl
  formUrl = this.newMonitorForm.get(
    "url"
  ) as FormControl
  formExpectedStatus = this.newMonitorForm.get(
    "expectedStatus"
  ) as FormControl
  formInterval = this.newMonitorForm.get(
    "interval"
  ) as FormControl

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private organizationsService: OrganizationsService,
    private uptimeService: UptimeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.organizationsService.activeOrganizationSlug$
      .subscribe((orgSlug) => {
        this.orgSlug = orgSlug
      })
  }

  onSubmit() {
    if (this.newMonitorForm.valid && this.orgSlug) {
      this.loading = true;
      this.uptimeService.createMonitor(
        this.newMonitorForm.value,
        this.orgSlug
      )
      .pipe(
        tap((monitor) => {
          this.loading = false
          this.snackBar.open(`${monitor.name} has been created`);
          this.router.navigate([this.orgSlug, "uptime-monitors", monitor.id]);
        }
        ),
        catchError((err) => {
          this.loading = false;
          this.error = `${err.statusText}: ${err.status}`;
          return EMPTY;
        })
      )
      .subscribe();
    }
  }

}

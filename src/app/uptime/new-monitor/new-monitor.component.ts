import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { UptimeService } from "../uptime.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { urlValidator, numberValidator } from "src/app/shared/validators";


@Component({
  selector: "gt-new-monitor",
  templateUrl: "./new-monitor.component.html",
  styleUrls: ["./new-monitor.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default
})

export class NewMonitorComponent implements OnInit {

  orgSlug?: string | null;
  error$ = this.uptimeService.error$;
  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  loading$ = this.uptimeService.createLoading$;


  typeChoices = [
    "Ping",
    "GET",
    "POST",
    "Heartbeat"
  ];


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
      Validators.max(86399)
    ]),
    project: new FormControl(""),
  });

  formName = this.newMonitorForm.get(
    "name"
  ) as FormControl;
  formMonitorType = this.newMonitorForm.get(
    "monitorType"
  ) as FormControl;
  formUrl = this.newMonitorForm.get(
    "url"
  ) as FormControl;
  formExpectedStatus = this.newMonitorForm.get(
    "expectedStatus"
  ) as FormControl;
  formInterval = this.newMonitorForm.get(
    "interval"
  ) as FormControl;

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private organizationsService: OrganizationsService,
    private uptimeService: UptimeService,
  ) { }

  ngOnInit(): void {
    this.organizationsService.activeOrganizationSlug$
      .subscribe((orgSlug) => {
        this.orgSlug = orgSlug;
      });
  }

  onSubmit() {
    if (this.newMonitorForm.valid) {
      this.uptimeService.createMonitor(
        this.newMonitorForm.value,
      )
    }
  }

}

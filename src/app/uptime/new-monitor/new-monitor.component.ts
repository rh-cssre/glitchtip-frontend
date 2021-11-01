import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import { catchError, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { UptimeService } from "../uptime.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";

function numberValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === "number") {
    return null;
  }
  return { invalidNumber: true };
}
const pattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)?/gi
const urlReg = new RegExp(pattern);

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
  projectEnvironments$ = this.uptimeService.projectEnvironments$;

  monitorTypes = ['Ping', 'GET', 'POST', 'Heartbeat']
  selectedEnvironment = "";
  environmentsDisabled = false;
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
      //Not working?
      Validators.pattern(urlReg),
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
    environment: new FormControl(""),
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
  formProject = this.newMonitorForm.get("project")

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private organizationsService: OrganizationsService,
    private uptimeService: UptimeService
  ) { }

  ngOnInit(): void {
    this.organizationsService.activeOrganizationSlug$
      .subscribe((orgSlug) => {
        this.orgSlug = orgSlug
      })
  }

  disableEnvironments() {
    this.environmentsDisabled = true;
  }

  projectSelected(projectSlug: string) {
    if (this.orgSlug) {
      this.newMonitorForm.get('environment')?.setValue("");
      this.selectedEnvironment = "";
      this.environmentsDisabled = false;
      this.uptimeService.getProjectEnvironments(
        this.orgSlug,
        projectSlug
      );
    }
  }

  onSubmit() {
    if (this.newMonitorForm.valid && this.orgSlug) {
      this.loading = true;
      this.uptimeService.createMonitor(
        this.newMonitorForm.value,
        this.orgSlug
      )
      .pipe(
        tap(() => {
          this.loading = false
          console.log(this.loading)
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

import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
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
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewMonitorComponent implements OnInit {

  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  projectEnvironments$ = this.uptimeService.projectEnvironments$;

  monitorTypes = ['Ping', 'GET', 'POST', 'Heartbeat']

  selectedEnvironment = "";

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
  
  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private organizationsService: OrganizationsService,
    private uptimeService: UptimeService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log("submitted")
  }

  projectSelected() {
    const selectedProject = this.newMonitorForm.get('project')?.value
    if (selectedProject) {
      this.organizationsService.activeOrganizationSlug$.subscribe(
        (orgSlug => {
          if (orgSlug) {
            this.newMonitorForm.get('environment')?.setValue("");
            this.selectedEnvironment = "";
            this.uptimeService.getProjectEnvironments(
              orgSlug,
              selectedProject
            );
          }
        })
      )
    };
  }

}

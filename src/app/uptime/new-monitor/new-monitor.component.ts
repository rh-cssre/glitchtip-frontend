import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  // FormGroupDirective,
  // NgForm,
} from "@angular/forms";
import { tap } from "rxjs/operators"
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { UptimeService } from "../uptime.service";

function numberValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === "number") {
    return null;
  }
  return { invalidNumber: true };
}

const urlReg = new RegExp(
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
);

@Component({
  selector: "gt-new-monitor",
  templateUrl: "./new-monitor.component.html",
  styleUrls: ["./new-monitor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewMonitorComponent implements OnInit {
  
  orgProjects$ = this.organizationsService.activeOrganizationProjects$;
  projectEnvironments$ = this.uptimeService.projectEnvironments$;

  monitorTypes = ['Ping', 'GET', 'POST', 'SSL', 'Heartbeat']
  
  newMonitorForm = new FormGroup({
    monitorType: new FormControl("", [
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
    expectedStatus: new FormControl("200", [
      Validators.required,
      numberValidator
    ]),
    interval: new FormControl("60", [
      Validators.required,
    ]),
    project: new FormControl(""),
    environment: new FormControl(""),
    
    //Environment
    //Project
    //Organization
  });

  constructor(
    private organizationsService: OrganizationsService,
    private uptimeService: UptimeService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log("submitted")
  }

  projectSelected () {
    const selectedProject = this.newMonitorForm.get('project')?.value
    if (selectedProject) {
      this.organizationsService.activeOrganizationSlug$.pipe(
        tap(orgSlug => {
          this.organizationsService.
        })
      )
    }
  }

  // this.routerEventSubscription = this.navigationEnd$.subscribe(
  //   ({ orgSlug, cursor }) => {
  //     if (orgSlug) {
  //       this.uptimeService.getMonitors(
  //         orgSlug,
  //         cursor
  //       );
  //     }
  //   }
  // );

}

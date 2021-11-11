import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { EMPTY } from "rxjs";
import {
  map,
  catchError,
  tap,
  filter,
  first
} from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { UptimeService } from "../uptime.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";

function numberValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === "number") {
    return null;
  }
  return { invalidNumber: true };
}

const pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&=]*)/gi
const urlReg = new RegExp(pattern);

@Component({
  selector: "gt-monitor-update",
  templateUrl: "./monitor-update.component.html",
  styleUrls: ["./monitor-update.component.scss"]
})

export class MonitorUpdateComponent implements OnInit {
  orgSlug?: string | null;
  monitorId?: string | null;
  monitor$ = this.uptimeService.activeMonitor$
  error = "";
  orgProjects$ = this.organizationsService.activeOrganizationProjects$;

  typeChoices = [
    'Ping',
    'GET',
    'POST',
    'Heartbeat'
  ]
  selectedEnvironment = "";
  loading = false;

  monitorEditForm = new FormGroup({
    monitorType: new FormControl("ping", [
      Validators.required,
    ]),
    name: new FormControl("", [
      Validators.required,
    ]),
    url: new FormControl("", [
      Validators.required,
      Validators.pattern(urlReg),
    ]),
    expectedStatus: new FormControl(200, [
      Validators.required,
      Validators.min(100),
      numberValidator
    ]),
    interval: new FormControl(60, [
      Validators.required,
      Validators.min(1),
      Validators.max(86399)
    ]),
    project: new FormControl(""),
  });

  formName = this.monitorEditForm.get(
    "name"
  ) as FormControl
  formMonitorType = this.monitorEditForm.get(
    "monitorType"
  ) as FormControl
  formUrl = this.monitorEditForm.get(
    "url"
  ) as FormControl
  formExpectedStatus = this.monitorEditForm.get(
    "expectedStatus"
  ) as FormControl
  formInterval = this.monitorEditForm.get(
    "interval"
  ) as FormControl
  formProject = this.monitorEditForm.get(
    "project"
  ) as FormControl


  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private uptimeService: UptimeService,
    private router: Router,
    private route: ActivatedRoute,
    private organizationsService: OrganizationsService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => {
          const orgSlug: string | undefined = params["org-slug"];
          const monitorId: string | undefined = params["monitor-id"];
          this.orgSlug = orgSlug;
          this.monitorId = monitorId;
          return { orgSlug, monitorId };
        })
      )
      .subscribe(({ orgSlug, monitorId }) => {
        if (orgSlug && monitorId) {
          this.uptimeService.retrieveMonitorDetails(orgSlug, monitorId);
        }
      });

    this.monitor$
      .pipe(
        filter((data) => !!data),
        first(),
        tap((data) => {
          this.formName.patchValue(data!.name,);
          this.formMonitorType.patchValue(data!.monitorType);
          this.formUrl.patchValue(data!.url);
          this.formExpectedStatus.patchValue(data!.expectedStatus);
          this.formInterval.patchValue(this.toSeconds(data!.interval));
          this.formProject.patchValue(data!.project);
        })
      )
      .subscribe();
  }

  toSeconds(interval: string) {
    let seconds = 0
    if (interval.includes(" ")) {
      seconds += parseInt(interval.split(" ")[0])
      interval = interval.split(" ")[1]
    }
    let splitInterval = interval.split(":")
    seconds += parseInt(splitInterval[0]) * 3600
    seconds += parseInt(splitInterval[1]) * 60
    seconds += parseInt(splitInterval[2])

    return seconds
  }

  onSubmit() {
    if (this.monitorEditForm.valid && this.orgSlug) {
      this.loading = true;
      this.uptimeService.editMonitor(
        this.orgSlug,
        this.monitorId!,
        this.monitorEditForm.value,
      )
        .pipe(
          tap((monitor) => {
            this.loading = false
            this.snackBar.open(`${monitor.name} has been updated`);
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

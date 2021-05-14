import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
// import {
//   FormGroup,
//   FormControl,
//   Validators,
//   AbstractControl,
//   ValidationErrors,
// } from "@angular/forms";
import { ProjectAlertsService } from "./project-alerts.service";
// import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";

// function numberValidator(control: AbstractControl): ValidationErrors | null {
//   if (typeof control.value === "number") {
//     return null;
//   }
//   return { invalidNumber: true };
// }
@Component({
  selector: "app-project-alerts",
  templateUrl: "./project-alerts.component.html",
  styleUrls: ["./project-alerts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAlertsComponent implements OnInit, OnDestroy {
  // projectAlerts$ = this.alertsService.projectAlert$;
  // alertToggleLoading$ = this.alertsService.alertToggleLoading$;
  // alertToggleError$ = this.alertsService.alertToggleError$;
  // initialLoad$ = this.alertsService.initialLoad$;
  // loading$ = this.alertsService.loading$;
  // error$ = this.alertsService.error$;

  // projectAlertForm = new FormGroup({
  //   timespan_minutes: new FormControl("", [
  //     Validators.min(0),
  //     numberValidator,
  //     Validators.required,
  //   ]),
  //   quantity: new FormControl("", [
  //     Validators.min(0),
  //     numberValidator,
  //     Validators.required,
  //   ]),
  // });

  // matcher = new LessAnnoyingErrorStateMatcher();

  constructor(private alertsService: ProjectAlertsService) {
    // this.projectAlerts$.subscribe((data) => {
    //   if (data) {
    //     this.projectAlertForm.patchValue({
    //       timespan_minutes: data.timespan_minutes,
    //       quantity: data.quantity,
    //     });
    //   }
    // });
  }

  ngOnInit(): void {
    this.alertsService.listProjectAlerts();
  }

  ngOnDestroy() {
    // this.alertsService.clearState();
  }

  toggleProjectAlerts() {
    // this.alertsService.toggleProjectAlerts();
  }

  onSubmit() {
    // if (this.projectAlertForm.valid) {
    //   const timespan = this.projectAlertForm.get("timespan_minutes")?.value;
    //   const quantity = this.projectAlertForm.get("quantity")?.value;
    //   this.alertsService.updateProjectAlerts(timespan, quantity);
    // }
  }
}

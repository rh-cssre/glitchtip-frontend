import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormArray,
} from "@angular/forms";
import { ProjectAlertsService } from "./project-alerts.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";

function numberValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === "number") {
    return null;
  }
  return { invalidNumber: true };
}
@Component({
  selector: "app-project-alerts",
  templateUrl: "./project-alerts.component.html",
  styleUrls: ["./project-alerts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAlertsComponent implements OnInit, OnDestroy {
  projectAlerts$ = this.alertsService.projectAlert$;
  alertToggleLoading$ = this.alertsService.alertToggleLoading$;
  alertToggleError$ = this.alertsService.alertToggleError$;
  initialLoad$ = this.alertsService.initialLoad$;
  loading$ = this.alertsService.loading$;
  error$ = this.alertsService.error$;

  projectAlertForm = new FormGroup({
    alertTiming: new FormArray([]),
  });

  alertTiming = this.projectAlertForm.get("alertTiming") as FormArray;

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(private alertsService: ProjectAlertsService) {
    this.alertsService.listProjectAlerts();
  }

  ngOnInit(): void {
    // this.setFormState();
  }

  ngOnDestroy() {
    this.alertsService.clearState();
  }

  testDelete(i: number) {
    this.alertTiming.removeAt(i);
  }

  setFormState() {
    this.projectAlerts$.subscribe((alerts) => {
      if (alerts) {
        for (const alert of alerts) {
          this.alertTiming.push(
            new FormGroup({
              timespan_minutes: new FormControl(alert.timespan_minutes, [
                Validators.min(0),
                numberValidator,
                Validators.required,
              ]),
              quantity: new FormControl(alert.quantity, [
                Validators.min(0),
                numberValidator,
                Validators.required,
              ]),
            })
          );
        }
      }
    });
  }

  updateAlertTiming(pk: number, index: number) {
    // console.log("update alert timing");
    const item = this.alertTiming.at(index).value;
    const timespan = item.timespan_minutes;
    const quant = item.quantity;
    console.log(pk, quant, timespan);
  }

  removeRecipient(alertPk: number, recipientPk?: number) {
    // console.log(`alert pk: ${alertPk}, recipientPk: ${recipientPk}`);
  }

  addRecipient() {
    // console.log("open modal");
  }

  toggleProjectAlerts() {
    // this.alertsService.toggleProjectAlerts();
  }

  removeAlert(pk: number, index: number) {
    console.log("remove alert: ", pk);
    this.alertTiming.removeAt(index);
    this.alertsService.deleteAlert(pk);
  }

  onSubmit() {
    // if (this.projectAlertForm.valid) {
    //   const timespan = this.projectAlertForm.get("timespan_minutes")?.value;
    //   const quantity = this.projectAlertForm.get("quantity")?.value;
    //   this.alertsService.updateProjectAlerts(timespan, quantity);
    // }
  }
}

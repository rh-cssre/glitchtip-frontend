import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { numberValidator } from "src/app/shared/validators";

export class NewAlertErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && form?.touched);
  }
}

@Component({
  selector: "gt-alert-form",
  templateUrl: "./alert-form.component.html",
  styleUrls: ["./alert-form.component.scss"],
})
export class AlertFormComponent implements OnInit {
  @Input() loading: boolean | null = false;
  @Input() timespan: number | null = 1;
  @Input() quantity: number | null = 1;
  @Input() uptime: boolean | null = false;
  @Output() alertSubmit = new EventEmitter<{
    timespan_minutes: number;
    quantity: number;
    uptime: boolean;
  }>();
  @Input() newAlert: boolean | undefined = false;

  intervalValidators = [
    Validators.min(0),
    numberValidator,
    Validators.required,
  ];

  projectAlertForm = new FormGroup({
    timespan_minutes: new FormControl(""),
    quantity: new FormControl(""),
    uptime: new FormControl(""),
  });

  errorAlertsOn: boolean = true;
  errorAlertsOnInitial: boolean = true;

  projectFormTimespan = this.projectAlertForm.get(
    "timespan_minutes"
  ) as FormControl;
  projectFormQuantity = this.projectAlertForm.get("quantity") as FormControl;
  projectFormUptime = this.projectAlertForm.get("uptime") as FormControl;

  matcher = new LessAnnoyingErrorStateMatcher();
  newFormMatcher = new NewAlertErrorStateMatcher();

  constructor() {}

  ngOnInit(): void {
    this.projectAlertForm.setValue({
      timespan_minutes: this.timespan ? this.timespan : "",
      quantity: this.quantity ? this.quantity : "",
      uptime: this.uptime,
    });

    this.errorAlertsOn = !this.timespan && !this.quantity ? false : true;
    this.errorAlertsOnInitial = !this.timespan && !this.quantity ? false : true;

    if (this.errorAlertsOn) {
      this.initializeIntervalValidation();
    }
  }

  toggleErrorAlerts(): void {
    this.errorAlertsOn = !this.errorAlertsOn;

    if (!this.errorAlertsOn) {
      this.projectFormQuantity.clearValidators();
      this.projectFormQuantity.setValue("");
      this.projectFormTimespan.clearValidators();
      this.projectFormTimespan.setValue("");
      this.projectAlertForm.updateValueAndValidity()
    } else {
      this.initializeIntervalValidation();
      this.projectFormQuantity.setValue(1);
      this.projectFormTimespan.setValue(1);
      this.projectAlertForm.updateValueAndValidity();
    }
  }

  toggleFromInput(): void {
    if (!this.errorAlertsOn) {
      this.errorAlertsOn = true;
      this.initializeIntervalValidation();
      this.projectFormQuantity.setValue(1);
      this.projectFormTimespan.setValue(1);
      this.projectFormTimespan.updateValueAndValidity()
    }
  }

  initializeIntervalValidation(): void {
    this.projectFormQuantity.setValidators(this.intervalValidators);
    this.projectFormTimespan.setValidators(this.intervalValidators);
  }

  onSubmit(): void {
    if (this.projectAlertForm.valid) {
      this.alertSubmit.emit({
        timespan_minutes: this.errorAlertsOn
          ? this.projectFormTimespan.value
          : null,
        quantity: this.errorAlertsOn ? this.projectFormQuantity.value : null,
        uptime: this.projectFormUptime.value,
      });
    }
  }
}

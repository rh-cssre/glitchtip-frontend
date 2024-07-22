import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { intRegex } from "src/app/shared/validators";
import { LoadingButtonComponent } from "../../../../../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgIf } from "@angular/common";

export class NewAlertErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && form?.touched);
  }
}

export const selectionRequiredValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const errorAlert = control.get("errorAlert");
  const uptime = control.get("uptime");

  return errorAlert?.value || uptime?.value
    ? null
    : { selectionRequired: true };
};

@Component({
  selector: "gt-alert-form",
  templateUrl: "./alert-form.component.html",
  styleUrls: ["./alert-form.component.scss"],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingButtonComponent,
  ],
})
export class AlertFormComponent implements OnInit {
  @Input() loading: boolean | null = false;
  @Input() timespan: number | null = 1;
  @Input() quantity: number | null = 1;
  @Input() uptime: boolean | null = false;
  @Input() errorAlert: boolean = true;
  @Output() alertSubmit = new EventEmitter<{
    timespanMinutes: number;
    quantity: number;
    uptime: boolean;
  }>();
  @Input() newAlert: boolean | undefined = false;

  intervalValidators = [
    Validators.min(0),
    Validators.pattern(intRegex),
    Validators.required,
  ];

  projectAlertForm = new UntypedFormGroup({
    optionsGroup: new UntypedFormGroup(
      {
        uptime: new UntypedFormControl(""),
        errorAlert: new UntypedFormControl(""),
      },
      selectionRequiredValidator
    ),
    timespanMinutes: new UntypedFormControl(""),
    quantity: new UntypedFormControl(""),
  });

  projectFormTimespan = this.projectAlertForm.get(
    "timespanMinutes"
  ) as UntypedFormControl;
  projectFormQuantity = this.projectAlertForm.get(
    "quantity"
  ) as UntypedFormControl;
  projectFormUptime = this.projectAlertForm.get(
    "optionsGroup.uptime"
  ) as UntypedFormControl;
  projectFormErrorAlert = this.projectAlertForm.get(
    "optionsGroup.errorAlert"
  ) as UntypedFormControl;
  projectFormOptionsGroup = this.projectAlertForm.get(
    "optionsGroup"
  ) as UntypedFormGroup;

  matcher = new LessAnnoyingErrorStateMatcher();
  newFormMatcher = new NewAlertErrorStateMatcher();

  constructor() {}

  ngOnInit(): void {
    this.projectAlertForm.setValue({
      timespanMinutes: this.timespan,
      quantity: this.quantity,
      optionsGroup: {
        uptime: this.uptime,
        errorAlert: this.errorAlert,
      },
    });

    if (this.errorAlert) {
      this.initializeIntervalValidation();
    }
  }

  toggleErrorAlerts(): void {
    this.projectFormErrorAlert.setValue(!this.projectFormErrorAlert.value);

    if (!this.projectFormErrorAlert.value) {
      this.projectFormQuantity.clearValidators();
      this.projectFormQuantity.setValue("");
      this.projectFormTimespan.clearValidators();
      this.projectFormTimespan.setValue("");
    } else {
      this.initializeIntervalValidation();
      this.projectFormQuantity.setValue(1);
      this.projectFormTimespan.setValue(1);
    }

    this.projectAlertForm.updateValueAndValidity();
  }

  toggleFromInput(): void {
    if (!this.projectFormErrorAlert.value) {
      this.projectFormErrorAlert.setValue(true);
      this.initializeIntervalValidation();
      this.projectFormQuantity.setValue(1);
      this.projectFormTimespan.setValue(1);
      this.projectFormTimespan.updateValueAndValidity();
    }
  }

  toggleUptime(): void {
    this.projectFormUptime.setValue(!this.projectFormUptime.value);
  }

  initializeIntervalValidation(): void {
    this.projectFormQuantity.setValidators(this.intervalValidators);
    this.projectFormTimespan.setValidators(this.intervalValidators);
  }

  onSubmit(): void {
    if (this.projectAlertForm.valid) {
      this.alertSubmit.emit({
        timespanMinutes: this.projectFormErrorAlert.value
          ? this.projectFormTimespan.value
          : null,
        quantity: this.projectFormErrorAlert.value
          ? this.projectFormQuantity.value
          : null,
        uptime: this.projectFormUptime.value,
      });
    }
  }
}

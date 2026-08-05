import { I18nPluralPipe } from "@angular/common";
import {
  Component,
  OnInit,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
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
import { MatSelectModule } from "@angular/material/select";

export class NewAlertErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!(control && control.invalid && form?.touched);
  }
}

export const selectionRequiredValidator: ValidatorFn = (
  control: AbstractControl,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    I18nPluralPipe,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LoadingButtonComponent,
  ],
})
export class AlertFormComponent implements OnInit {
  readonly loading = input<boolean | null>(false);
  readonly timespan = input<number | null>(1);
  readonly quantity = input<number | null>(1);
  readonly uptime = input<boolean | null>(false);
  readonly errorAlert = input<boolean>(true);
  /** Environments already selected on this alert */
  readonly environments = input<string[]>([]);
  /** Environment names seen on this project, offered as options */
  readonly availableEnvironments = input<string[]>([]);
  readonly alertSubmit = output<{
    timespanMinutes: number;
    quantity: number;
    uptime: boolean;
    environments: string[];
  }>();
  readonly newAlert = input<boolean | undefined>(false);

  timesI18nMapping = {
    "=1": $localize`time`,
    other: $localize`times`,
  };

  minutesI18nMapping = {
    "=1": $localize`minute`,
    other: $localize`minutes`,
  };

  intervalValidators = [
    Validators.min(0),
    Validators.pattern(intRegex),
    Validators.required,
  ];

  projectAlertForm = new FormGroup({
    optionsGroup: new FormGroup(
      {
        uptime: new FormControl(""),
        errorAlert: new FormControl(""),
      },
      selectionRequiredValidator,
    ),
    timespanMinutes: new FormControl(""),
    quantity: new FormControl(""),
    environments: new FormControl<string[]>([]),
  });

  projectFormTimespan = this.projectAlertForm.get(
    "timespanMinutes",
  ) as FormControl;
  projectFormQuantity = this.projectAlertForm.get("quantity") as FormControl;
  projectFormUptime = this.projectAlertForm.get(
    "optionsGroup.uptime",
  ) as FormControl;
  projectFormErrorAlert = this.projectAlertForm.get(
    "optionsGroup.errorAlert",
  ) as FormControl;
  projectFormOptionsGroup = this.projectAlertForm.get(
    "optionsGroup",
  ) as FormGroup;
  projectFormEnvironments = this.projectAlertForm.get(
    "environments",
  ) as FormControl;

  /**
   * Already-selected environments are kept as options even when the project has
   * stopped reporting them, otherwise an existing selection would silently
   * vanish from the dropdown while still filtering the alert.
   */
  environmentOptions = computed(() => [
    ...new Set([...this.availableEnvironments(), ...this.environments()]),
  ]);

  matcher = new LessAnnoyingErrorStateMatcher();
  newFormMatcher = new NewAlertErrorStateMatcher();

  constructor() {}

  ngOnInit(): void {
    const timespan = this.timespan();
    const quantity = this.quantity();
    this.projectAlertForm.setValue({
      timespanMinutes: timespan ? timespan.toString() : null,
      quantity: quantity ? quantity.toString() : null,
      environments: [...this.environments()],
      optionsGroup: {
        uptime: this.uptime() as any,
        errorAlert: this.errorAlert() as any,
      },
    });

    if (this.errorAlert()) {
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

  /** Arrays compare by reference, so the Update button needs a value check */
  environmentsUnchanged(): boolean {
    const selected: string[] = this.projectFormEnvironments.value ?? [];
    const original = this.environments();
    return (
      selected.length === original.length &&
      selected.every((environment) => original.includes(environment))
    );
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
        environments: this.projectFormEnvironments.value ?? [],
      });
    }
  }
}

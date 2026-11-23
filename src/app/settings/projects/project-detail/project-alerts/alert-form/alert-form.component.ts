import {
  Component,
  DestroyRef,
  OnInit,
  inject,
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
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { intRegex } from "src/app/shared/validators";
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
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormErrorComponent,
  ],
})
export class AlertFormComponent implements OnInit {
  readonly timespan = input<number | null>(1);
  readonly quantity = input<number | null>(1);
  readonly uptime = input<boolean | null>(false);
  readonly errorAlert = input<boolean>(true);
  /**
   * Environments already selected on this alert. Undefined when the API predates
   * the field, so every read has to tolerate it.
   */
  readonly environments = input<string[] | undefined>([]);
  /** Environment names seen on this project, offered as options */
  readonly availableEnvironments = input<string[] | undefined>([]);
  readonly alertSubmit = output<{
    timespanMinutes: number;
    quantity: number;
    uptime: boolean;
    environments: string[];
  }>();
  readonly newAlert = input<boolean | undefined>(false);
  /** The conditions after each edit, valid or not, for live summaries. */
  readonly conditionsChange = output<{
    timespanMinutes: number | null;
    quantity: number | null;
    uptime: boolean;
    environments: string[];
  }>();
  readonly #destroyRef = inject(DestroyRef);

  intervalValidators = [
    Validators.min(1),
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
    ...new Set([
      ...(this.availableEnvironments() ?? []),
      ...(this.environments() ?? []),
    ]),
  ]);

  matcher = new LessAnnoyingErrorStateMatcher();
  newFormMatcher = new NewAlertErrorStateMatcher();

  constructor() {}

  ngOnInit(): void {
    const timespan = this.timespan();
    const quantity = this.quantity();
    // Unchecked event conditions still show numbers (greyed out), so checking
    // the box starts from something sensible.
    this.projectAlertForm.setValue({
      timespanMinutes: (timespan || 1).toString(),
      quantity: (quantity || 1).toString(),
      environments: [...(this.environments() ?? [])],
      optionsGroup: {
        uptime: this.uptime() as any,
        errorAlert: this.errorAlert() as any,
      },
    });

    if (this.errorAlert()) {
      this.initializeIntervalValidation();
    } else {
      this.projectFormQuantity.disable();
      this.projectFormTimespan.disable();
    }

    // Changes only: the parent seeds its copy from the same inputs, and emitting
    // during init would update its template mid-check.
    this.projectAlertForm.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.emitConditions());
  }

  private emitConditions() {
    const events = !!this.projectFormErrorAlert.value;
    this.conditionsChange.emit({
      quantity: events ? Number(this.projectFormQuantity.value) || null : null,
      timespanMinutes: events
        ? Number(this.projectFormTimespan.value) || null
        : null,
      uptime: !!this.projectFormUptime.value,
      environments: this.projectFormEnvironments.value ?? [],
    });
  }

  toggleErrorAlerts(): void {
    this.projectFormErrorAlert.setValue(!this.projectFormErrorAlert.value);

    // Disabled fields keep their numbers but drop out of validation.
    if (!this.projectFormErrorAlert.value) {
      this.projectFormQuantity.disable();
      this.projectFormTimespan.disable();
    } else {
      this.initializeIntervalValidation();
      this.projectFormQuantity.enable();
      this.projectFormTimespan.enable();
      if (!this.projectFormQuantity.value) this.projectFormQuantity.setValue(1);
      if (!this.projectFormTimespan.value) this.projectFormTimespan.setValue(1);
    }

    this.projectAlertForm.updateValueAndValidity();
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
        environments: this.projectFormEnvironments.value ?? [],
      });
    }
  }
}

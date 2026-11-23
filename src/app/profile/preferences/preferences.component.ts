import {
  Component,
  OnInit,
  effect,
  inject,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatOptionModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";

function autocompleteStringValidator(validOptions: Array<string>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (validOptions.indexOf(control.value) !== -1) {
      return null; /* valid option selected */
    }
    return { invalidAutocompleteString: { value: control.value } };
  };
}

@Component({
  selector: "gt-preferences",
  templateUrl: "./preferences.component.html",
  styleUrls: ["./preferences.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatOptionModule,
    LoadingButtonComponent,
    SettingsSectionComponent,
    FormErrorComponent,
  ],
})
export class PreferencesComponent implements OnInit {
  private service = inject(UserService);
  private settings = inject(SettingsService);

  defaultTimeZone: string = "Default";
  timeZones: string[] = (Intl as any).supportedValuesOf("timeZone");
  currentTimeZone = Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.replace(/_/g, " ");
  form = new FormGroup({
    name: new FormControl("", Validators.maxLength(255)),
    timeZone: new FormControl("", {
      validators: [autocompleteStringValidator(this.timeZones)],
    }),
    theme: new FormControl(
      "",
      autocompleteStringValidator(["system", "light", "dark"]),
    ),
  });
  filteredOptions = signal<string[]>([]);
  saving = signal<{ name?: boolean; timeZone?: boolean }>({});
  themeError = signal<string | null>(null);
  userDetails = this.service.user;
  serverTimeZone = this.settings.serverTimeZone;

  formTimeZone = this.form.get("timeZone") as FormControl;

  constructor() {
    effect(() => {
      const serverTimeZone = this.serverTimeZone();
      if (serverTimeZone) {
        this.defaultTimeZone = "Default" + ` \(${serverTimeZone}\)`;
        if (!this.timeZones.includes(this.defaultTimeZone)) {
          this.timeZones.unshift(this.defaultTimeZone);
        }
        if (this.form.controls.timeZone.value === "") {
          this.form.controls.timeZone.setValue(this.defaultTimeZone);
        }
      }
    });

    const userDetailsInit = effect(() => {
      const user = this.userDetails();
      if (user) {
        this.form.controls.name.setValue(user.name!);
        if (user.options!.timezone) {
          if (!this.timeZones.includes(user.options.timezone)) {
            this.timeZones.unshift(user.options.timezone); // Existing TZ always valid
          }
          this.form.controls.timeZone.setValue(user.options.timezone);
        }
        // No event: only a click on the toggle should save the theme.
        this.form.controls.theme.setValue(
          user.options!.preferredTheme || "system",
          { emitEvent: false },
        );
        // Ensure effect only runs once after user details are loaded
        userDetailsInit.destroy();
      }
    });
  }

  ngOnInit() {
    this.filteredOptions.set(this._filter(""));

    this.form.controls["timeZone"].valueChanges.subscribe((value) => {
      this.filteredOptions.set(this._filter(value || ""));
    });
    this.form.controls.theme.valueChanges.subscribe(() => this.save("theme"));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().replace(/\s/g, "_");

    return this.timeZones.filter((option) =>
      option.toLowerCase().includes(filterValue),
    );
  }

  clearTimeZone() {
    this.formTimeZone.setValue("");
  }

  /**
   * Saves one setting. The other two go back as they are saved, not as they
   * sit in the form, so an unsaved edit in another section is not sent.
   */
  async save(field: "name" | "timeZone" | "theme") {
    const control = this.form.controls[field];
    control.markAsTouched();
    const user = this.userDetails();
    if (control.invalid || !user) return;

    let name = user.name ?? "";
    let timezone = user.options?.timezone;
    let preferredTheme = user.options?.preferredTheme;
    if (field === "name") name = control.value ?? "";
    if (field === "timeZone") {
      timezone =
        control.value === this.defaultTimeZone ? "" : (control.value ?? "");
    }
    if (field === "theme") preferredTheme = control.value ?? undefined;

    const options = {
      ...(timezone !== undefined && timezone !== null && { timezone }),
      ...(preferredTheme && { preferredTheme }),
    };
    if (field === "theme") {
      // Save-on-change: lock the toggle, stay quiet on success, roll back on failure.
      this.themeError.set(null);
      control.disable({ emitEvent: false });
      try {
        const saved = await this.service.updateUser(name, options, {
          silent: true,
        });
        if (!saved) {
          control.setValue(user.options?.preferredTheme || "system", {
            emitEvent: false,
          });
          this.themeError.set(
            $localize`Error attempting to update preferences`,
          );
        }
      } finally {
        control.enable({ emitEvent: false });
      }
      return;
    }
    this.saving.update((saving) => ({ ...saving, [field]: true }));
    try {
      await this.service.updateUser(name, options);
    } finally {
      this.saving.update((saving) => ({ ...saving, [field]: false }));
    }
  }
}

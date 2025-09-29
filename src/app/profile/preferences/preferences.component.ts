import { Component, OnInit, effect, inject, signal } from "@angular/core";
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
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

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
  imports: [
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatOptionModule,
    LoadingButtonComponent,
  ],
})
export class PreferencesComponent implements OnInit {
  private service = inject(UserService);
  private settings = inject(SettingsService);

  defaultTimeZone: string = "Default";
  timeZones: string[] = (Intl as any).supportedValuesOf("timeZone");
  currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
  userDetails = this.service.user;
  serverTimeZone = this.settings.serverTimeZone;

  formName = this.form.get("name") as FormControl;
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
        if (user.options!.preferredTheme) {
          this.form.controls.theme.setValue(user.options.preferredTheme);
        } else {
          this.form.controls.theme.setValue("light");
        }
        // Ensure effect only runs once after user details are loaded
        userDetailsInit.destroy()
      }
    });
  }

  ngOnInit() {
    this.filteredOptions.set(this._filter(""));

    this.form.controls["timeZone"].valueChanges.subscribe((value) => {
      this.filteredOptions.set(this._filter(value || ""));
    });
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

  onSubmit() {
    if (this.form.valid) {
      const name = this.form.value.name!;
      let timeZone = this.form.value.timeZone;
      const preferredTheme = this.form.value.theme;

      if (timeZone === this.defaultTimeZone) {
        timeZone = "";
      }
      const options = {
        ...(timeZone !== null && { timezone: timeZone }),
        ...(preferredTheme !== null && { preferredTheme }),
      };
      this.service.updateUser(name, options);
    }
  }
}

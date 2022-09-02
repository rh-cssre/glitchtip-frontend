import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { filter, map, Observable, startWith, take } from "rxjs";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";

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
})
export class PreferencesComponent implements OnInit {
  defaultTimeZone: string = "Default";
  timeZones: string[] = (Intl as any).supportedValuesOf("timeZone");
  currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  form = new FormGroup({
    name: new FormControl("", Validators.maxLength(255)),
    timeZone: new FormControl("", {
      validators: [autocompleteStringValidator(this.timeZones)],
    }),
  });
  filteredOptions?: Observable<string[]>;
  userDetails$ = this.service.userDetails$;
  serverTimeZone$ = this.settings.serverTimeZone$;

  formName = this.form.get("name") as FormControl;
  formTimeZone = this.form.get("timeZone") as FormControl;

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(
    private service: UserService,
    private settings: SettingsService
  ) {}

  ngOnInit() {
    this.serverTimeZone$
      .pipe(
        filter((serverTimeZone) => !!serverTimeZone),
        take(1)
      )
      .subscribe((serverTimeZone) => {
        this.defaultTimeZone = this.defaultTimeZone + ` \(${serverTimeZone}\)`;
        this.timeZones.unshift(this.defaultTimeZone);
        if (this.form.controls.timeZone.value === "") {
          this.form.controls.timeZone.setValue(this.defaultTimeZone);
        }
      });
    this.userDetails$.subscribe((user) => {
      if (user) {
        this.form.controls.name.setValue(user.name);
      }
      if (user?.options.timezone) {
        if (!this.timeZones.includes(user.options.timezone)) {
          this.timeZones.unshift(user.options.timezone); // Existing TZ always valid
        }
        this.form.controls.timeZone.setValue(user.options.timezone);
      }
    });
    this.filteredOptions = this.form.controls["timeZone"].valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value || ""))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().replace(/\s/g, "_");

    return this.timeZones.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  clearTimeZone() {
    this.formTimeZone.setValue("");
  }

  onSubmit() {
    if (this.form.valid) {
      const name = this.form.value.name!;
      let timeZone = this.form.value.timeZone;
      if (timeZone === this.defaultTimeZone) {
        timeZone = "";
      }
      const options = {
        ...(timeZone !== null && { timezone: timeZone }),
      };
      this.service.updateUserOptions(name, options);
    }
  }
}

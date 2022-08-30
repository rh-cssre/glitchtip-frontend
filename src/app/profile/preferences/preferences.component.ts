import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { map, Observable, startWith } from "rxjs";
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

const defaultTimeZone = "Default";

@Component({
  selector: "gt-preferences",
  templateUrl: "./preferences.component.html",
  styleUrls: ["./preferences.component.scss"],
})
export class PreferencesComponent implements OnInit {
  timeZones: string[] = (Intl as any).supportedValuesOf("timeZone");
  currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  form = new FormGroup({
    name: new FormControl("", Validators.maxLength(255)),
    timeZone: new FormControl(defaultTimeZone, {
      validators: [autocompleteStringValidator(this.timeZones)],
    }),
  });
  filteredOptions?: Observable<string[]>;
  userDetails$ = this.service.userDetails$;

  formName = this.form.get("name") as FormControl;
  formTimeZone = this.form.get("timeZone") as FormControl;

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor(private service: UserService) {}

  ngOnInit() {
    this.timeZones.unshift(defaultTimeZone);
    this.userDetails$.subscribe((user) => {
      if (user) {
        this.form.controls.name.setValue(user.name);
      }
      if (user?.options.timezone) {
        if (!this.timeZones.includes(user.options.timezone)) {
          this.timeZones.unshift(user.options.timezone); // Existing TZ always valid
        }
        this.form.controls.timeZone.setValue(user.options.timezone);
        this.currentTimeZone = user.options.timezone;
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

  onSubmit() {
    if (this.form.valid) {
      const name = this.form.value.name!;
      let timeZone = this.form.value.timeZone;
      if (timeZone === defaultTimeZone) {
        timeZone = "";
      }
      const options = {
        ...(timeZone !== null && { timezone: timeZone }),
      };
      this.service.updateUserOptions(name, options);
    }
  }
}

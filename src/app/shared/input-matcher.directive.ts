import { Directive, input } from "@angular/core";
import {
  Validator,
  NG_VALIDATORS,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";

@Directive({
  standalone: true,
  selector: "[gtInputMatcher]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: InputMatcherDirective,
      multi: true,
    },
  ],
})
export class InputMatcherDirective implements Validator {
  readonly gtInputMatcher = input<string>();

  validate(control: AbstractControl): ValidationErrors | null {
    const gtInputMatcher = this.gtInputMatcher();
    if (gtInputMatcher !== undefined) {
      const comparisonInput = control.parent!.get(gtInputMatcher);
      if (comparisonInput && comparisonInput.value !== control.value) {
        return { notEqual: true };
      } else {
        return null;
      }
    }
    return null;
  }
}

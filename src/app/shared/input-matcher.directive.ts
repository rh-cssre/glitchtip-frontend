import { Directive, Input } from "@angular/core";
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
  @Input() gtInputMatcher?: string;

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.gtInputMatcher !== undefined) {
      const comparisonInput = control.parent!.get(this.gtInputMatcher);
      if (comparisonInput && comparisonInput.value !== control.value) {
        return { notEqual: true };
      } else {
        return null;
      }
    }
    return null;
  }
}

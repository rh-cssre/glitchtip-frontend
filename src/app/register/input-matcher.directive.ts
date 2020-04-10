import { Directive, Input } from "@angular/core";
import { Validator, NG_VALIDATORS, AbstractControl } from "@angular/forms";

@Directive({
  selector: "[appInputMatcher]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: InputMatcherDirective,
      multi: true,
    },
  ],
})
export class InputMatcherDirective implements Validator {
  @Input() appInputMatcher: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    const comparisonInput = control.parent.get(this.appInputMatcher);
    if (comparisonInput && comparisonInput.value !== control.value) {
      return { notEqual: true };
    } else {
      return null;
    }
  }
}

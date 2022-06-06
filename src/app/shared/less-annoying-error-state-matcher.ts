import { ErrorStateMatcher } from "@angular/material/core";
import { UntypedFormControl, FormGroupDirective, NgForm } from "@angular/forms";

export class LessAnnoyingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && form?.submitted);
  }
}

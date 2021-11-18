import { AbstractControl, ValidationErrors } from "@angular/forms";

export function urlValidator(control: AbstractControl): ValidationErrors | null {
  let validationCheck = null;
  try {
    validationCheck = new URL(control.value);
    return null;
  } catch {
    validationCheck = { invalidUrl: true };
    return validationCheck;
  }
}

export function numberValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === "number") {
    return null;
  }
  return { invalidNumber: true };
}

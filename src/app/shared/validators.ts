import { AbstractControl, ValidationErrors } from "@angular/forms";

export function urlValidator(control: AbstractControl): ValidationErrors | null {
  let validUrl = true;
  try {
    new URL(control.value)
  } catch {
    validUrl = false;
  }
  return validUrl ? null : { invalidUrl: true };
}

export function numberValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === "number") {
    return null;
  }
  return { invalidNumber: true };
}
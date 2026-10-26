import { FormGroup } from "@angular/forms";

interface FieldErrors {
  [key: string]: string[];
}

/**
Maps field errors like {name: ["required"]} to FormGroup form controls
of the same name
*/
export function mapFormErrors(fieldErrors: FieldErrors, form: FormGroup) {
  Object.keys(form.controls).forEach((field) => {
    const control = form.get(field);
    if (fieldErrors[field] && control) {
      control.setErrors({ serverError: fieldErrors[field] });
    }
  });
}

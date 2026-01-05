import { Component, ChangeDetectionStrategy, input } from "@angular/core";

import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "gt-form-error",
  imports: [MatInputModule],
  templateUrl: "./form-error.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
  errors = input<string[]>();
  readonly error = input<any>(); // Do not use
}

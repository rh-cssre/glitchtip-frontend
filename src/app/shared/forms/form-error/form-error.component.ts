import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
} from "@angular/core";

import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "gt-form-error",
  imports: [MatInputModule],
  templateUrl: "./form-error.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  // No margins: the slot or container it sits in spaces it.
  styles: `
    :host {
      display: block;
      font: var(--mat-sys-body-small);
    }
  `,
})
export class FormErrorComponent {
  errors = input<string | string[] | null | undefined>();
  messages = computed(() => {
    const errors = this.errors();
    return (Array.isArray(errors) ? errors : [errors]).filter(
      (msg): msg is string => !!msg,
    );
  });
}

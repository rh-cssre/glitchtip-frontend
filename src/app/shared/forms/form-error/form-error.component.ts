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
  styles: `
    :host {
      display: block;
    }
    :host:not(:empty) {
      margin-bottom: var(--gt-space-3, 12px);
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

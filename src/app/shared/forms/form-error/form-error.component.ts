import {
  Component,
  ChangeDetectionStrategy,
  input,
  Input,
} from "@angular/core";

import { MatInputModule } from "@angular/material/input";

@Component({
  standalone: true,
  selector: "gt-form-error",
  imports: [MatInputModule],
  templateUrl: "./form-error.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
  errors = input<string[]>();
  @Input() error: any; // Do not use
}

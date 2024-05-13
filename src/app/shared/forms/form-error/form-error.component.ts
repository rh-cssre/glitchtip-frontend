import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { ServerError } from "../../django.interfaces";

@Component({
  standalone: true,
  selector: "gt-form-error",
  imports: [CommonModule, MatInputModule],
  templateUrl: "./form-error.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
  @Input() error: ServerError | null | undefined = null;
}

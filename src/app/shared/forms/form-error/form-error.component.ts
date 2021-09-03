import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { ServerError } from "../../django.interfaces";

@Component({
  selector: "gt-form-error",
  templateUrl: "./form-error.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
  @Input() error: ServerError | null | undefined = null;
}

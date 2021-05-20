import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";

function numberValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === "number") {
    return null;
  }
  return { invalidNumber: true };
}

@Component({
  selector: "app-alert-form",
  templateUrl: "./alert-form.component.html",
  styleUrls: ["./alert-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertFormComponent implements OnInit {
  @Input() loading: boolean | null = false;
  @Input() timespan: number | null = null;
  @Input() quantity: number | null = null;
  @Input() pk: number | null = null;
  @Output() alertSubmit = new EventEmitter<{
    alert: number;
    quantity: number;
    pk: number;
  }>();

  projectAlertForm = new FormGroup({
    timespan_minutes: new FormControl("", [
      Validators.min(0),
      numberValidator,
      Validators.required,
    ]),
    quantity: new FormControl("", [
      Validators.min(0),
      numberValidator,
      Validators.required,
    ]),
  });

  matcher = new LessAnnoyingErrorStateMatcher();

  constructor() {}

  ngOnInit(): void {
    this.projectAlertForm.setValue({
      timespan_minutes: this.timespan,
      quantity: this.quantity,
    });
  }

  onSubmit() {
    console.log("submit");
  }
}

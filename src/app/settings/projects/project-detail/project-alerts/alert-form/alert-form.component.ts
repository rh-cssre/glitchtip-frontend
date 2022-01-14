import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { LessAnnoyingErrorStateMatcher } from "src/app/shared/less-annoying-error-state-matcher";
import { numberValidator } from "src/app/shared/validators";

export class NewAlertErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control && control.invalid && form?.touched);
  }
}

@Component({
  selector: "gt-alert-form",
  templateUrl: "./alert-form.component.html",
  styleUrls: ["./alert-form.component.scss"],
})
export class AlertFormComponent implements OnInit {
  @Input() loading: boolean | null = false;
  @Input() toggleIssueAlerts: boolean = false;
  @Input() timespan: number | null = 1;
  @Input() quantity: number | null = 1;
  @Output() alertSubmit = new EventEmitter<{
    timespan_minutes: number;
    quantity: number;
  }>();
  @Input() newAlert: boolean | undefined = false;

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
    enableUptimeAlerts: new FormControl("")
  });

  projectFormTimespan = this.projectAlertForm.get(
    "timespan_minutes"
  ) as FormControl;
  projectFormQuantity = this.projectAlertForm.get("quantity") as FormControl;

  matcher = new LessAnnoyingErrorStateMatcher();
  newFormMatcher = new NewAlertErrorStateMatcher();

  constructor() {}

  ngOnInit(): void {
    this.projectAlertForm.setValue({
      timespan_minutes: this.timespan,
      quantity: this.quantity,
      enableUptimeAlerts: true,
    });
  }

  onSubmit(): void {
    if (this.projectAlertForm.valid) {
      this.alertSubmit.emit({
        timespan_minutes: this.projectFormTimespan.value,
        quantity: this.projectFormQuantity.value,
      });
    }
  }
}

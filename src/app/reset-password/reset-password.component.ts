import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ResetPasswordService } from "../api/reset-password/reset-password.service";

@Component({
  selector: "gt-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  sendResetEmailError$ = this.resetService.sendResetEmailError$;
  sendResetEmailLoading$ = this.resetService.sendResetEmailLoading$;
  sendResetEmailSuccess$ = this.resetService.sendResetEmailSuccess$;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  constructor(private resetService: ResetPasswordService) {}

  get email() {
    return this.form.get("email");
  }

  onSubmit() {
    if (this.form.valid) {
      this.resetService.sendResetEmail(this.form.value.email);
    }
  }

  reset() {
    this.resetService.clearState();
  }
}

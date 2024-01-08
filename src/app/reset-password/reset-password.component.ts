import { Component, ChangeDetectionStrategy } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { ResetPasswordService } from "../api/reset-password/reset-password.service";
import { SettingsService } from "../api/settings.service";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgIf, AsyncPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "gt-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    LoadingButtonComponent,
    MatButtonModule,
    RouterLink,
    AsyncPipe,
  ],
})
export class ResetPasswordComponent {
  sendResetEmailError$ = this.resetService.sendResetEmailError$;
  sendResetEmailLoading$ = this.resetService.sendResetEmailLoading$;
  sendResetEmailSuccess$ = this.resetService.sendResetEmailSuccess$;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });
  enableUserRegistration$ = this.settings.enableUserRegistration$;

  constructor(
    private resetService: ResetPasswordService,
    private settings: SettingsService
  ) {}

  get email() {
    return this.form.get("email");
  }

  onSubmit() {
    if (this.form.valid && this.form.value.email) {
      this.resetService.sendResetEmail(this.form.value.email);
    }
  }

  reset() {
    this.resetService.clearState();
  }
}

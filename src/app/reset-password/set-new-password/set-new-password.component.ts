import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  effect,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatCardModule } from "@angular/material/card";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { InputMatcherDirective } from "../../shared/input-matcher.directive";
import {
  ResetPasswordService,
  ResetPasswordState,
} from "../reset-password.service";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";

@Component({
  templateUrl: "./set-new-password.component.html",
  styleUrls: ["./set-new-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    FormErrorComponent,
    MatFormFieldModule,
    MatInputModule,
    InputMatcherDirective,
    LoadingButtonComponent,
    RouterLink,
  ],
})
export class SetNewPasswordComponent extends StatefulComponent<
  ResetPasswordState,
  ResetPasswordService
> {
  private router = inject(Router);
  protected service: ResetPasswordService;
  private snackBar = inject(MatSnackBar);
  readonly key = input.required<string>();

  formErrors = this.service.formErrors;
  success = this.service.success;
  loading = this.service.loading;
  form = new FormGroup({
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    password2: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get password() {
    return this.form.get("password");
  }

  get password2() {
    return this.form.get("password2");
  }

  constructor() {
    const service = inject(ResetPasswordService);

    effect(() => mapFormErrors(service.fieldErrors(), this.form));
    super(service);

    this.service = service;
  }

  async onSubmit() {
    if (this.form.valid) {
      const data = await this.service.resetPassword(
        this.key(),
        this.form.value.password!,
      );
      if (data) {
        this.snackBar.open("Your password has been changed.");
        this.router.navigate(["/login"]);
      }
    }
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  computed,
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
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SetNewPasswordService } from "./set-new-password-state";

@Component({
  templateUrl: "./set-new-password.html",
  styleUrls: ["./set-new-password.scss"],
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
  providers: [SetNewPasswordService],
})
export class SetNewPassword {
  private router = inject(Router);
  protected service = inject(SetNewPasswordService);
  private snackBar = inject(MatSnackBar);
  readonly key = input.required<string>();

  formErrors = computed(() =>
    this.service.errors().map((error) => error.message),
  );
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

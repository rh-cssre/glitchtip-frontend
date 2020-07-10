import { Component, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { PasswordService } from "./password.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent {
  @ViewChild(FormGroupDirective) formDirective?: FormGroupDirective;

  loading = false;
  error: string | null | undefined;
  form = new FormGroup({
    old_password: new FormControl("", [Validators.required]),
    new_password1: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    new_password2: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  get old_password() {
    return this.form.get("old_password");
  }

  get new_password1() {
    return this.form.get("new_password1");
  }

  get new_password2() {
    return this.form.get("new_password2");
  }

  constructor(
    private passwordService: PasswordService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.passwordService
        .changePassword(
          this.form.value.old_password,
          this.form.value.new_password1,
          this.form.value.new_password2
        )
        .subscribe(
          () => {
            this.formDirective?.resetForm();
            this.snackBar.open("Your new password has been saved.");
            this.loading = false;
            this.error = null;
          },
          (err) => {
            this.loading = false;
            if (err.status === 400 && err.error.old_password) {
              this.error = "Your current password is incorrect.";
            } else {
              this.error = "Error: " + err.statusText;
            }
          }
        );
    }
  }
}

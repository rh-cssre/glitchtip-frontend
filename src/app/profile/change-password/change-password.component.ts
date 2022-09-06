import { Component, OnInit, ViewChild } from "@angular/core";
import {
  Validators,
  FormGroupDirective,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { PasswordService } from "./password.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "src/app/api/user/user.service";
import { AuthService } from "src/app/api/auth/auth.service";
import { map, take, mergeMap, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";

@Component({
  selector: "gt-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective?: FormGroupDirective;
  user$ = this.userService.userDetails$;
  passwordResetLoading = false;
  passwordResetSuccess = false;

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
    private snackBar: MatSnackBar,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userService.getUserDetails();
    this.passwordResetSuccess = false;
    this.passwordResetLoading = false;
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.passwordService
        .changePassword(
          this.form.value.old_password!,
          this.form.value.new_password1!,
          this.form.value.new_password2!
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
            } else if (err.status === 400 && err.error.new_password2) {
              this.new_password2?.setErrors({
                serverError: err.error.new_password2,
              });
            } else {
              this.error = "Error: " + err.statusText;
            }
          }
        );
    }
  }

  passwordReset() {
    this.passwordResetSuccess = false;
    this.passwordResetLoading = true;
    this.user$
      .pipe(
        map((user) => user?.email),
        take(1),
        mergeMap((email) => {
          if (email) {
            return this.authService.passwordReset(email).pipe(
              tap(() => {
                this.passwordResetSuccess = true;
                this.passwordResetLoading = false;
              })
            );
          }
          return EMPTY;
        })
      )
      .toPromise();
  }
}

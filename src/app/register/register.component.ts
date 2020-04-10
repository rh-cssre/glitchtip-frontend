import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RegisterService } from "./register.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  loading = false;
  error: string;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password1: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    password2: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {}

  get email() {
    return this.form.get("email");
  }

  get password1() {
    return this.form.get("password1");
  }

  get password2() {
    return this.form.get("password2");
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.registerService
        .register(
          this.form.value.email,
          this.form.value.password1,
          this.form.value.password2
        )
        .subscribe(
          () => this.router.navigate([""]),
          (err) => {
            this.loading = false;
            if (err.status === 400 && err.error.non_field_errors) {
              this.error = err.error.non_field_errors;
            } else if (err.status === 400 && err.error.email) {
              this.email?.setErrors({ serverError: err.error.email });
            } else {
              this.error = "Error";
            }
          }
        );
    }
  }
}

import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RegisterService } from "./register.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AcceptInviteService } from "../api/accept/accept-invite.service";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  loading = false;
  error: string | undefined;
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
  acceptInfo$ = this.acceptService.acceptInfo$;

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private route: ActivatedRoute,
    private acceptService: AcceptInviteService
  ) {}

  ngOnInit() {
    this.acceptInfo$
      .pipe(
        tap((acceptInfo) => {
          if (acceptInfo) {
            this.form.patchValue({ email: acceptInfo.org_user.email });
          }
        })
      )
      .subscribe();
  }

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
          () => {
            const query = this.route.snapshot.queryParamMap;
            const next = query.get("next");
            if (next) {
              this.router.navigateByUrl(next);
            } else {
              this.router.navigate([""]);
            }
          },
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

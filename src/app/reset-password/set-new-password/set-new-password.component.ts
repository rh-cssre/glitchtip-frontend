import { Component, ChangeDetectionStrategy } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatCardModule } from "@angular/material/card";
import { lastValueFrom } from "rxjs";
import { exhaustMap, map, tap } from "rxjs/operators";
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
  selector: "gt-set-new-password",
  templateUrl: "./set-new-password.component.html",
  styleUrls: ["./set-new-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    FormErrorComponent,
    MatFormFieldModule,
    MatInputModule,
    InputMatcherDirective,
    LoadingButtonComponent,
    RouterLink
],
})
export class SetNewPasswordComponent extends StatefulComponent<
  ResetPasswordState,
  ResetPasswordService
> {
  params$ = this.activatedRoute.params.pipe(
    map((params) => ({ key: params.key })),
  );
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected service: ResetPasswordService,
    private snackBar: MatSnackBar,
  ) {
    toObservable(service.fieldErrors).subscribe((fieldErrors) =>
      mapFormErrors(fieldErrors, this.form),
    );
    super(service);
  }

  onSubmit() {
    if (this.form.valid) {
      lastValueFrom(
        this.params$.pipe(
          exhaustMap((params) =>
            this.service
              .resetPassword(params.key, this.form.value.password!)
              .pipe(
                tap((resp) => {
                  if (resp && resp.status === 401) {
                    this.snackBar.open("Your password has been changed.");
                    this.router.navigate(["/login"]);
                  }
                }),
              ),
          ),
        ),
      );
    }
  }
}

import { Component, ChangeDetectionStrategy } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AsyncPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { toObservable } from "@angular/core/rxjs-interop";
import { lastValueFrom } from "rxjs";
import { SettingsService } from "../api/settings.service";
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import {
  ResetPasswordService,
  ResetPasswordState,
} from "./reset-password.service";
import { mapFormErrors } from "../shared/forms/form.utils";
import { FormErrorComponent } from "../shared/forms/form-error/form-error.component";
import { StatefulComponent } from "../shared/stateful-service/signal-state.component";

@Component({
  selector: "gt-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormErrorComponent,
    LoadingButtonComponent,
    MatButtonModule,
    RouterLink,
    AsyncPipe
],
})
export class ResetPasswordComponent extends StatefulComponent<
  ResetPasswordState,
  ResetPasswordService
> {
  success = this.service.success;
  loading = this.service.loading;
  formErrors = this.service.formErrors;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });
  enableUserRegistration$ = this.settings.enableUserRegistration$;

  constructor(
    protected service: ResetPasswordService,
    private settings: SettingsService,
  ) {
    toObservable(service.fieldErrors).subscribe((fieldErrors) =>
      mapFormErrors(fieldErrors, this.form),
    );
    super(service);
  }

  get email() {
    return this.form.get("email");
  }

  onSubmit() {
    if (this.form.valid && this.form.value.email) {
      lastValueFrom(this.service.requestPassword(this.form.value.email));
    }
  }

  reset() {
    this.service.clearState();
    this.form.reset();
    this.email!.setErrors(null);
  }
}

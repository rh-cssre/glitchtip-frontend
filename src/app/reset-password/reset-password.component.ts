import {
  Component,
  ChangeDetectionStrategy,
  inject,
  effect,
} from "@angular/core";
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
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import {
  ResetPasswordService,
  ResetPasswordState,
} from "./reset-password.service";
import { mapFormErrors } from "../shared/forms/form.utils";
import { FormErrorComponent } from "../shared/forms/form-error/form-error.component";
import { StatefulComponent } from "../shared/stateful-service/signal-state.component";
import { Autofocus } from "../shared/autofocus";
import { PanelComponent } from "../shared/panel/panel.component";
import { AuthBrandComponent } from "../shared/auth-brand/auth-brand.component";

@Component({
  selector: "gt-reset-password",
  templateUrl: "./reset-password.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PanelComponent,
    AuthBrandComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormErrorComponent,
    LoadingButtonComponent,
    MatButtonModule,
    RouterLink,
    Autofocus,
  ],
  providers: [ResetPasswordService],
})
export class ResetPasswordComponent extends StatefulComponent<
  ResetPasswordState,
  ResetPasswordService
> {
  protected service: ResetPasswordService;

  success = this.service.success;
  loading = this.service.loading;
  formErrors = this.service.formErrors;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  constructor() {
    const service = inject(ResetPasswordService);

    effect(() => mapFormErrors(service.fieldErrors(), this.form));
    super(service);

    this.service = service;
  }

  get email() {
    return this.form.get("email");
  }

  onSubmit() {
    if (this.form.valid && this.form.value.email) {
      this.service.requestPassword(this.form.value.email);
    }
  }

  reset() {
    this.service.clearState();
    this.form.reset();
    this.email!.setErrors(null);
  }
}

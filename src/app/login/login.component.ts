import { Component, OnInit } from "@angular/core";
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AsyncPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { lastValueFrom } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";
import { FormErrorComponent } from "../shared/forms/form-error/form-error.component";
import { LoginWebAuthnComponent } from "./login-webauthn/login-webauthn.component";
import { LoginTotpComponent } from "./login-totp/login-totp.component";
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import { mapFormErrors } from "../shared/forms/form.utils";
import { StatefulComponent } from "../shared/stateful-service/signal-state.component";
import { LoginService, LoginState } from "./login.service";
import { SettingsService } from "../api/settings.service";
import { AcceptInviteService } from "../api/accept/accept-invite.service";
import { SocialApp } from "../api/user/user.interfaces";
import { AuthSvgComponent } from "../shared/auth-svg/auth-svg.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "gt-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    LoginTotpComponent,
    LoginWebAuthnComponent,
    LoadingButtonComponent,
    ReactiveFormsModule,
    FormErrorComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AuthSvgComponent,
    RouterLink,
  ],
})
export class LoginComponent
  extends StatefulComponent<LoginState, LoginService>
  implements OnInit
{
  formErrors = this.service.formErrors;
  loading = this.service.loading;
  requiresMFA = this.service.requiresMfa;
  hasWebAuthn = this.service.hasWebAuthn;
  preferTOTP = this.service.preferTOTP;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  socialApps$ = this.settings.socialApps$;
  enableUserRegistration$ = this.settings.enableUserRegistration$;
  acceptInfo$ = this.acceptService.acceptInfo$;

  constructor(
    protected service: LoginService,
    private settings: SettingsService,
    private acceptService: AcceptInviteService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    toObservable(service.fieldErrors).subscribe((fieldErrors) =>
      mapFormErrors(fieldErrors, this.form),
    );
    super(service);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params["socialLoginError"]) {
        this.snackBar.open(
          $localize`Unknown problem using Social Authentication`,
        );
      }
    });
  }

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  onSocialApp(socialApp: SocialApp) {
    this.service.socialLogin(socialApp.provider);
  }

  onSubmit() {
    if (this.form.valid) {
      lastValueFrom(
        this.service.login(this.form.value.email!, this.form.value.password!),
      );
    }
  }
}

import { Component, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { tap } from "rxjs/operators";
import { LoginService } from "./login.service";
import { AuthService } from "../api/auth/auth.service";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { SettingsService } from "../api/settings.service";
import { AcceptInviteService } from "../api/accept/accept-invite.service";
import { SocialApp } from "../api/user/user.interfaces";
import { AuthSvgComponent } from "../shared/auth-svg/auth-svg.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormErrorComponent } from "../shared/forms/form-error/form-error.component";
import { LoginFido2Component } from "./login-fido2/login-fido2.component";
import { LoginTotpComponent } from "./login-totp/login-totp.component";
import { NgIf, NgFor, AsyncPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "gt-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [
    MatCardModule,
    NgIf,
    LoginTotpComponent,
    LoginFido2Component,
    ReactiveFormsModule,
    FormErrorComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgFor,
    AuthSvgComponent,
    RouterLink,
    AsyncPipe,
  ],
})
export class LoginComponent implements OnInit {
  loading$ = this.loginService.loading$;
  error$ = this.loginService.error$;
  requiresMFA$ = this.loginService.requiresMFA$;
  hasFido2$ = this.loginService.hasFIDO2$;
  useTOTP$ = this.loginService.useTOTP$;
  form = new UntypedFormGroup({
    email: new UntypedFormControl("", [Validators.required, Validators.email]),
    password: new UntypedFormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  socialApps$ = this.settings.socialApps$;
  enableUserRegistration$ = this.settings.enableUserRegistration$;
  acceptInfo$ = this.acceptService.acceptInfo$;

  constructor(
    private loginService: LoginService,
    private oauthService: GlitchTipOAuthService,
    private settings: SettingsService,
    private acceptService: AcceptInviteService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.acceptInfo$
      .pipe(
        tap((acceptInfo) => {
          if (acceptInfo) {
            this.form.patchValue({ email: acceptInfo.orgUser.email });
          }
        })
      )
      .subscribe();
    this.error$.subscribe((error) => {
      if (error?.email) {
        this.email?.setErrors({ serverError: error.email });
      } else if (error?.password) {
        this.password?.setErrors({ serverError: error.password });
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
    this.oauthService.initOAuthLogin(socialApp);
  }

  onSubmit() {
    if (this.form.valid) {
      const nextUrl = this.route.snapshot.queryParamMap.get("next");
      if (nextUrl) {
        this.authService.setRedirectUrl(nextUrl);
      }
      this.loginService
        .login(this.form.value.email, this.form.value.password)
        .subscribe();
    }
  }
}

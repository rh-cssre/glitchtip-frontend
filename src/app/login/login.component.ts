import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { tap } from "rxjs/operators";
import { LoginService } from "./login.service";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { SettingsService } from "../api/settings.service";
import { AcceptInviteService } from "../api/accept/accept-invite.service";
import { LessAnnoyingErrorStateMatcher } from "../shared/less-annoying-error-state-matcher";
import { SocialApp } from "../api/user/user.interfaces";
import { AuthService } from "../api/auth/auth.service";
import { ServerError } from "../shared/django.interfaces";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loading = false;
  error?: ServerError;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  matcher = new LessAnnoyingErrorStateMatcher();

  socialApps$ = this.settings.socialApps$;
  enableUserRegistration$ = this.settings.enableUserRegistration$;
  acceptInfo$ = this.acceptService.acceptInfo$;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private oauthService: GlitchTipOAuthService,
    private settings: SettingsService,
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

  get password() {
    return this.form.get("password");
  }

  onSocialApp(socialApp: SocialApp) {
    if (socialApp.provider === "github") {
      this.oauthService.initGithubLogin(socialApp.client_id);
    } else if (socialApp.provider === "gitlab") {
      this.oauthService.initGitlabLogin(socialApp.client_id);
    } else if (socialApp.provider === "google") {
      this.oauthService.initGoogleLogin(socialApp.client_id);
    } else if (socialApp.provider === "microsoft") {
      this.oauthService.initMicrosoftLogin(socialApp.client_id);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.loginService
        .login(this.form.value.email, this.form.value.password)
        .subscribe(
          () => {
            this.authService.afterLogin();
          },
          (err) => {
            this.loading = false;
            if (err.status === 400 && err.error.non_field_errors) {
              this.error = err.error;
            } else if (err.status === 400 && err.error.email) {
              this.email?.setErrors({ serverError: err.error.email });
            } else if (err.status === 400 && err.error.password) {
              this.password?.setErrors({ serverError: err.error.password });
            } else {
              this.error = { non_field_errors: ["Error"] };
            }
          }
        );
    }
  }
}

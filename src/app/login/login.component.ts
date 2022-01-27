import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { tap } from "rxjs/operators";
import { LoginService } from "./login.service";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { SettingsService } from "../api/settings.service";
import { AcceptInviteService } from "../api/accept/accept-invite.service";
import { SocialApp } from "../api/user/user.interfaces";

@Component({
  selector: "gt-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loading$ = this.loginService.loading$;
  error$ = this.loginService.error$;
  requiresMFA$ = this.loginService.requiresMFA$;
  hasFido2$ = this.loginService.hasFIDO2$;
  useTOTP$ = this.loginService.useTOTP$;
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
    private loginService: LoginService,
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
    if (socialApp.provider === "github") {
      this.oauthService.initGithubLogin(socialApp.client_id, socialApp.authorize_url);
    } else if (socialApp.provider === "gitlab") {
      this.oauthService.initGitlabLogin(socialApp.client_id, socialApp.authorize_url);
    } else if (socialApp.provider === "google") {
      this.oauthService.initGoogleLogin(socialApp.client_id, socialApp.authorize_url);
    } else if (socialApp.provider === "microsoft") {
      this.oauthService.initMicrosoftLogin(socialApp.client_id, socialApp.authorize_url);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loginService
        .login(this.form.value.email, this.form.value.password)
        .subscribe();
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { LoginService } from "./login.service";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { SettingsService } from "../api/settings.service";
import { AcceptInviteService } from "../api/accept/accept-invite.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loading = false;
  error?: string;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  socialAuth$ = this.settings.socialAuth$;
  enableUserRegistration$ = this.settings.enableUserRegistration$;
  acceptInfo$ = this.acceptService.acceptInfo$;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
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

    const fragment = this.route.snapshot.fragment;
    const query = this.route.snapshot.queryParamMap;
    const provider = this.route.snapshot.paramMap.get("provider");

    if (fragment) {
      const accessToken = new URLSearchParams(fragment).get("access_token");
      if (accessToken) {
        if (provider === "gitlab") {
          this.oauthService
            .gitlabLogin(accessToken)
            .pipe(
              catchError((error: HttpErrorResponse) => {
                this.processSocialAuthErrorResponse(error);
                return EMPTY;
              })
            )
            .toPromise();
        } else if (provider === "google") {
          this.oauthService
            .googleLogin(accessToken)
            .pipe(
              catchError((error: HttpErrorResponse) => {
                this.processSocialAuthErrorResponse(error);
                return EMPTY;
              })
            )
            .toPromise();
        } else if (provider === "microsoft") {
          this.oauthService
            .microsoftLogin(accessToken)
            .pipe(
              catchError((error: HttpErrorResponse) => {
                this.processSocialAuthErrorResponse(error);
                return EMPTY;
              })
            )
            .toPromise();
        }
      }
    } else if (query) {
      const code = query.get("code");
      if (code) {
        if (provider === "github") {
          this.oauthService
            .githubLogin(code)
            .pipe(
              catchError((error: HttpErrorResponse) => {
                this.processSocialAuthErrorResponse(error);
                return EMPTY;
              })
            )
            .toPromise();
        }
      }
    }
  }

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  gitlab() {
    this.oauthService.initGitlabLogin();
  }

  github() {
    this.oauthService.initGithubLogin();
  }

  google() {
    this.oauthService.initGoogleLogin();
  }

  microsoft() {
    this.oauthService.initMicrosoftLogin();
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.loginService
        .login(this.form.value.email, this.form.value.password)
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
            } else if (err.status === 400 && err.error.password) {
              this.password?.setErrors({ serverError: err.error.password });
            } else {
              this.error = "Error";
            }
          }
        );
    }
  }

  private processSocialAuthErrorResponse(error: HttpErrorResponse) {
    if (error.status === 400) {
      this.error = error.error.non_field_errors;
    }
  }
}

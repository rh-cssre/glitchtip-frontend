import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoginService } from "./login.service";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { SettingsService } from "../api/settings.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loading = false;
  error: string;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8)
    ])
  });
  socialAuth$ = this.settings.socialAuth$;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private oauthService: GlitchTipOAuthService,
    private settings: SettingsService
  ) {}

  ngOnInit() {
    const fragment = this.route.snapshot.fragment;
    const query = this.route.snapshot.queryParamMap;
    const provider = this.route.snapshot.paramMap.get("provider");

    if (fragment) {
      const accessToken = new URLSearchParams(fragment).get("access_token");
      if (accessToken) {
        if (provider === "gitlab") {
          this.oauthService.gitlabLogin(accessToken).toPromise();
        } else if (provider === "google") {
          this.oauthService.googleLogin(accessToken).toPromise();
        } else if (provider === "microsoft") {
          this.oauthService.microsoftLogin(accessToken).toPromise();
        }
      }
    } else if (query) {
      const code = query.get("code");
      if (code) {
        if (provider === "github") {
          this.oauthService.githubLogin(code).toPromise();
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
          () => this.router.navigate([""]),
          err => {
            this.loading = false;
            if (err.status === 400 && err.error.non_field_errors) {
              this.error = err.error.non_field_errors;
            } else {
              this.error = "Error";
            }
          }
        );
    }
  }
}

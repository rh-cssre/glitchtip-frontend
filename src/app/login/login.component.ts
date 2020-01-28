import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { OAuthService } from "angular-oauth2-oidc";
import { LoginService } from "./login.service";
import { gitlabAuthConfig } from "../social";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  loading = false;
  error: string;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8)
    ])
  });

  constructor(
    private loginService: LoginService,
    private router: Router,
    private oauthService: OAuthService
  ) {
    this.oauthService.configure(gitlabAuthConfig);

    // this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    // this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  lol() {
    console.log(this.oauthService.scope);
    this.oauthService.initLoginFlow();
  }

  public get name() {
    const claims: any = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims.given_name;
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

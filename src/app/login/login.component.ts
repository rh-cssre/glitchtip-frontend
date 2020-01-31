import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LoginService } from "./login.service";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";

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

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private oauthService: GlitchTipOAuthService
  ) {}

  ngOnInit() {
    const fragment = this.route.snapshot.fragment;
    if (fragment) {
      const accessToken = new URLSearchParams(fragment).get("access_token");
      if (accessToken) {
        this.oauthService.gitlabConnect(accessToken).toPromise();
      }
    }
  }

  gitlab() {
    this.oauthService.initGitlabLogin();
  }

  google() {}

  microsoft() {}

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

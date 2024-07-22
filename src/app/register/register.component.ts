import { Component, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { tap } from "rxjs/operators";
import { RegisterService } from "./register.service";
import { AcceptInviteService } from "../api/accept/accept-invite.service";
import { SettingsService } from "../api/settings.service";
import { SocialApp } from "../api/user/user.interfaces";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { getUTM, setStorageWithExpiry } from "../shared/shared.utils";
import { AuthSvgComponent } from "../shared/auth-svg/auth-svg.component";
import { MatButtonModule } from "@angular/material/button";
import { InputMatcherDirective } from "../shared/input-matcher.directive";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgIf, NgFor, AsyncPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "gt-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    InputMatcherDirective,
    MatButtonModule,
    NgFor,
    AuthSvgComponent,
    RouterLink,
    AsyncPipe,
  ],
})
export class RegisterComponent implements OnInit {
  socialApps$ = this.settings.socialApps$;
  loading = false;
  error = "";
  tags = "";
  form = new UntypedFormGroup({
    email: new UntypedFormControl("", [Validators.required, Validators.email]),
    password1: new UntypedFormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    password2: new UntypedFormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  acceptInfo$ = this.acceptService.acceptInfo$;

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private route: ActivatedRoute,
    private acceptService: AcceptInviteService,
    private settings: SettingsService,
    private oauthService: GlitchTipOAuthService
  ) {}

  ngOnInit() {
    this.tags = getUTM().toString();

    this.acceptInfo$
      .pipe(
        tap((acceptInfo) => {
          if (acceptInfo) {
            this.form.patchValue({ email: acceptInfo.orgUser.email });
          }
        })
      )
      .subscribe();
  }

  get email() {
    return this.form.get("email");
  }

  get password1() {
    return this.form.get("password1");
  }

  get password2() {
    return this.form.get("password2");
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = "";
      this.registerService
        .register(
          this.form.value.email,
          this.form.value.password1,
          this.form.value.password2,
          this.tags
        )
        .subscribe(
          () => {
            const query = this.route.snapshot.queryParamMap;
            const next = query.get("next");
            if (next) {
              this.router.navigateByUrl(next);
            } else {
              this.router.navigate(["organizations", "new"]);
            }
          },
          (err) => {
            this.loading = false;
            if (err.status === 400 && err.error.non_field_errors) {
              this.error = err.error.non_field_errors;
            } else if (err.status === 400 && err.error.email) {
              this.email?.setErrors({ serverError: err.error.email });
            } else if (err.status === 400 && err.error.password1) {
              this.password1?.setErrors({ serverError: err.error.password1 });
            } else if (err.status === 400 && err.error.password2) {
              this.password2?.setErrors({ serverError: err.error.password2 });
            } else {
              this.error = `${err.statusText}: ${err.status}`;
            }
          }
        );
    }
  }

  onSocialApp(socialApp: SocialApp) {
    const utm = getUTM().toString();
    if (utm) {
      setStorageWithExpiry("register", utm, 5 * 60 * 1000);
    }

    this.oauthService.initOAuthLogin(socialApp);
  }
}

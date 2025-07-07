import { Component, OnInit, effect, inject, input } from "@angular/core";
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MarkdownComponent, provideMarkdown } from "ngx-markdown";
import { AuthSvgComponent } from "../shared/auth-svg/auth-svg.component";
import { InputMatcherDirective } from "../shared/input-matcher.directive";
import { RegisterService, RegisterState } from "./register.service";
import { SettingsService } from "../api/settings.service";
import { getUTM } from "../shared/shared.utils";
import { FormErrorComponent } from "../shared/forms/form-error/form-error.component";
import { mapFormErrors } from "../shared/forms/form.utils";
import { StatefulComponent } from "../shared/stateful-service/signal-state.component";
import type { components } from "src/app/api/api-schema";
import { AcceptInviteService } from "../accept/accept-invite/accept-invite.service";

type SocialApp = components["schemas"]["SocialAppSchema"];

@Component({
  selector: "gt-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MarkdownComponent,
    FormErrorComponent,
    InputMatcherDirective,
    MatButtonModule,
    AuthSvgComponent,
    RouterLink,
  ],
  providers: [provideMarkdown()],
})
export class RegisterComponent
  extends StatefulComponent<RegisterState, RegisterService>
  implements OnInit
{
  protected service: RegisterService;
  private router = inject(Router);
  private acceptService = inject(AcceptInviteService);
  private settings = inject(SettingsService);
  instanceName = this.settings.instanceName;
  next = input<string | undefined>();

  tags = "";
  socialApps = this.settings.socialApps;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
    password2: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  formErrors = this.service.formErrors;
  acceptInfo = this.acceptService.acceptInfo;

  constructor() {
    const service = inject(RegisterService);

    effect(() => mapFormErrors(service.fieldErrors(), this.form));
    super(service);

    this.service = service;
  }

  ngOnInit() {
    this.tags = getUTM().toString();
    const acceptInfo = this.acceptInfo();
    if (acceptInfo) {
      this.form.patchValue({ email: acceptInfo.orgUser.email });
    }
  }

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  get password2() {
    return this.form.get("password2");
  }

  async onSubmit() {
    if (this.form.valid) {
      const nextUrl = this.next();
      const data = await this.service.register(
        this.form.value.email!,
        this.form.value.password!,
      );
      if (data?.meta.is_authenticated) {
        if (nextUrl) {
          this.router.navigateByUrl(nextUrl);
        } else {
          this.router.navigate(["organizations", "new"]);
        }
      }
    }
  }

  onSocialApp(socialApp: SocialApp) {
    this.service.socialRegister(socialApp.provider);
  }
}

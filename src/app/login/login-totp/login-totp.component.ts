import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  Signal,
  effect,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { LoginState, LoginService } from "../login.service";

@Component({
  selector: "gt-login-totp",
  templateUrl: "./login-totp.component.html",
  styleUrls: ["./login-totp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterLink,
  ],
})
export class LoginTotpComponent
  extends StatefulComponent<LoginState, LoginService>
  implements AfterViewInit
{
  private changeDetector = inject(ChangeDetectorRef);
  private loginService: LoginService;
  private router = inject(Router);

  hasWebAuthn: Signal<boolean> | undefined;
  @ViewChild("input") input!: ElementRef;
  form = new FormGroup({
    code: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(16),
    ]),
    remember: new FormControl(false),
  });

  constructor() {
    const loginService = inject(LoginService);

    effect(() => mapFormErrors(loginService.fieldErrors(), this.form));
    super(loginService);
    this.hasWebAuthn = loginService.hasWebAuthn;
    this.loginService = loginService;
  }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
    this.changeDetector.detectChanges();
  }

  get code() {
    return this.form.get("code");
  }

  switchMethod() {
    this.loginService.switchMethod();
  }

  restartLogin() {
    this.loginService.restartLogin();
  }

  async onSubmit() {
    if (this.form.valid && this.code) {
      const code = this.code.value!;
      const data = await this.loginService.totpAuthenticate(code);
      if (data) {
        this.router.navigate(["/"]);
      }
    }
  }
}

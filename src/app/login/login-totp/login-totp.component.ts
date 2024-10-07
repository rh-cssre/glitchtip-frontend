import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
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
import { FormErrorComponent } from "../../shared/forms/form-error/form-error.component";
import { lastValueFrom, tap } from "rxjs";

@Component({
  selector: "gt-login-totp",
  templateUrl: "./login-totp.component.html",
  styleUrls: ["./login-totp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormErrorComponent,
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
  hasWebAuthn = this.loginService.hasWebAuthn;
  @ViewChild("input") input!: ElementRef;
  form = new FormGroup({
    code: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(16),
    ]),
    remember: new FormControl(false),
  });

  constructor(
    private changeDetector: ChangeDetectorRef,
    private loginService: LoginService,
    private router: Router,
  ) {
    toObservable(loginService.fieldErrors).subscribe((fieldErrors) =>
      mapFormErrors(fieldErrors, this.form),
    );
    super(loginService);
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

  onSubmit() {
    if (this.form.valid && this.code) {
      const code = this.code.value!;
      lastValueFrom(
        this.loginService
          .totpAuthenticate(code)
          .pipe(tap(() => this.router.navigate(["/"]))),
      );
    }
  }
}

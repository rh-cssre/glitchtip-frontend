import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../login.service";

@Component({
  selector: "gt-login-totp",
  templateUrl: "./login-totp.component.html",
  styleUrls: ["./login-totp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginTotpComponent implements OnInit, AfterViewInit {
  @ViewChild("input") input!: ElementRef;
  error$ = this.loginService.error$;
  hasFIDO2$ = this.loginService.hasFIDO2$;
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
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.error$.subscribe((error) => {
      if (error?.code) {
        this.code?.setErrors({ serverError: error.code });
      }
    });
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

  onSubmit() {
    if (this.form.valid && this.code) {
      const code = this.code.value!;
      if (code.length === 6) {
        this.loginService
          .authenticateTOTP(code, this.form.value.remember === true)
          .subscribe();
      } else {
        this.loginService.authenticateBackupCode(code).subscribe();
      }
    }
  }
}

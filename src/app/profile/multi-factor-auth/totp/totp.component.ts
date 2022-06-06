import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import * as QRCode from "qrcode";
import { combineLatest } from "rxjs";
import { delay, filter, tap } from "rxjs/operators";
import { MultiFactorAuthService } from "../multi-factor-auth.service";

@Component({
  selector: "gt-totp",
  templateUrl: "./totp.component.html",
  styleUrls: ["./totp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TOTPComponent implements OnInit, OnDestroy {
  @ViewChild("canvas", { static: false }) canvas: ElementRef | undefined;
  TOTPKey$ = this.service.TOTPKey$;
  TOTP$ = this.service.totp$;
  step$ = this.service.setupTOTPStage$;
  error$ = this.service.serverError$;
  copiedCodes$ = this.service.copiedCodes$;
  codeForm = new UntypedFormGroup({
    code: new UntypedFormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  constructor(private service: MultiFactorAuthService) {}

  get code() {
    return this.codeForm.get("code");
  }

  ngOnInit() {
    combineLatest([this.service.totp$, this.step$])
      .pipe(
        filter(([totp, step]) => step === 3 && totp !== null),
        delay(0),
        tap(([totp, _]) => this.generateQRCode(totp!.provisioning_uri))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.service.clearState();
  }

  incrementStep() {
    this.service.incrementTOTPStage();
  }

  decrementStep() {
    this.service.decrementTOTPStage();
  }

  enableTOTP() {
    if (this.codeForm.valid) {
      const code = this.code;
      if (code) {
        this.service.enableTOTP(code.value).pipe().subscribe();
      }
    }
  }

  deleteKey(keyId: number) {
    this.service.deleteKey(keyId, "TOTP").subscribe();
  }

  getStepIsDone(step: number, currentStep: number) {
    if (currentStep < step) {
      return "false";
    } else if (currentStep === step) {
      return "doing";
    }
    return "true";
  }

  generateQRCode(value: string) {
    if (this.canvas) {
      QRCode.toCanvas(this.canvas.nativeElement, value);
    }
  }
}

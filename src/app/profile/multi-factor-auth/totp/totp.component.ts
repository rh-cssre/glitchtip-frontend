import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as QRCode from "qrcode";
import { combineLatest } from "rxjs";
import { delay, filter, take, tap } from "rxjs/operators";
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
  codeForm = new FormGroup({
    code: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });
  backupCodeForm = new FormGroup({
    backupCode: new FormControl("", [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
    ]),
  });

  constructor(private service: MultiFactorAuthService) {}

  get code() {
    return this.codeForm.get("code");
  }

  get backupCode() {
    return this.backupCodeForm.get("backupCode");
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
    this.service.deleteKey(keyId).subscribe();
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

  copyCodes() {
    this.service.backupCodes$.pipe(take(1)).subscribe((codes) => {
      if (codes) {
        navigator.clipboard.writeText(codes.join("\n"));
        this.service.setCopiedCodes();
      }
    });
  }

  downloadCodes() {
    this.service.backupCodes$.pipe(take(1)).subscribe((codes) => {
      if (codes) {
        this.download("glitchtip-backup.txt", codes.join("\n"));
        this.service.setCopiedCodes();
      }
    });
  }

  verifyBackupCode() {
    const code = this.backupCodeForm.get("backupCode")?.value;
    if (this.backupCodeForm.valid && code) {
      this.service.verifyBackupCode(code).subscribe();
    }
  }

  private download(filename: string, text: string) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}

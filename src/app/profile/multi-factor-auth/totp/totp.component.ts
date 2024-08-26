import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import QRCode from "qrcode";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";

import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { toObservable } from "@angular/core/rxjs-interop";
import { MultiFactorAuthService } from "../multi-factor-auth.service";
import { FormErrorComponent } from "../../../shared/forms/form-error/form-error.component";
import { ToDoItemComponent } from "../../../shared/to-do-item/to-do-item.component";
import { BackupCodesComponent } from "./backup-codes/backup-codes.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "gt-totp",
  templateUrl: "./totp.component.html",
  styleUrls: ["./totp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    BackupCodesComponent,
    ToDoItemComponent,
    ReactiveFormsModule,
    FormErrorComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class TOTPComponent implements OnInit, OnDestroy {
  @ViewChild("canvas", { static: false }) canvas: ElementRef | undefined;
  TOTPAuthenticator = this.service.TOTPAuthenticator;
  totp = this.service.totp;
  totp$ = toObservable(this.totp);
  step = this.service.setupTOTPStage;
  formErrors = this.service.formErrors;
  codeForm = new FormGroup({
    code: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  constructor(private service: MultiFactorAuthService) {
    toObservable(service.fieldErrors).subscribe((fieldErrors) =>
      mapFormErrors(fieldErrors, this.codeForm),
    );
  }

  get code() {
    return this.codeForm.get("code");
  }

  ngOnInit() {
    this.totp$.subscribe((totp) => {
      if (totp) {
        this.generateQRCode(totp.totpUrl);
      }
    });
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
      if (code?.value) {
        lastValueFrom(this.service.activateTOTP(code.value));
      }
    }
  }

  deactivateTOTP() {
    lastValueFrom(this.service.deactivateTOTP());
  }

  getStepIsDone(step: number) {
    const currentStep = this.step();
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

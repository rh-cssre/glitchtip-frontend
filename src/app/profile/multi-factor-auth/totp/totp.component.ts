import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  OnDestroy,
  inject,
  effect,
  computed,
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
import { MatStepperModule } from "@angular/material/stepper";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { EmailsService } from "src/app/api/emails/emails.service";
import { MultiFactorAuthService } from "../multi-factor-auth.service";
import { FormErrorComponent } from "../../../shared/forms/form-error/form-error.component";
import { BackupCodesComponent } from "./backup-codes/backup-codes.component";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";

@Component({
  selector: "gt-totp",
  templateUrl: "./totp.component.html",
  styleUrls: ["./totp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatStepperModule,
    MatDialogModule,
    BackupCodesComponent,
    ReactiveFormsModule,
    FormErrorComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class TOTPComponent implements OnDestroy {
  private service = inject(MultiFactorAuthService);
  private dialog = inject(MatDialog);
  protected emailsService = inject(EmailsService);

  @ViewChild("canvas", { static: false }) canvas: ElementRef | undefined;
  TOTPAuthenticator = this.service.TOTPAuthenticator;
  totp = this.service.totp;
  step = this.service.setupTOTPStage;
  // Setup stage 2/3/4 maps to stepper step 0/1/2.
  stepperIndex = computed(() => Math.max(0, this.step() - 2));
  formErrors = this.service.formErrors;
  codeForm = new FormGroup({
    code: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  constructor() {
    const service = this.service;

    effect(() => mapFormErrors(service.fieldErrors(), this.codeForm));
    effect(() => {
      const totp = this.totp();
      if (totp) {
        this.generateQRCode(totp.totpUrl);
      }
    });
  }

  get code() {
    return this.codeForm.get("code");
  }

  ngOnDestroy() {
    this.service.clearState();
  }

  incrementStep() {
    this.service.incrementTOTPStage();
  }

  enableTOTP() {
    if (this.codeForm.valid) {
      const code = this.code;
      if (code?.value) {
        this.service.activateTOTP(code.value);
      }
    }
  }

  deactivateTOTP() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Disable TOTP`,
          message: $localize`Two-factor authentication will be turned off for your account.`,
          confirmText: $localize`Disable`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.service.deactivateTOTP();
        }
      });
  }

  generateQRCode(value: string) {
    if (this.canvas) {
      QRCode.toCanvas(this.canvas.nativeElement, value);
    }
  }
}

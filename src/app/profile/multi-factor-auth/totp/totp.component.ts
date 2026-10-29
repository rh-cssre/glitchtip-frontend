import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  OnDestroy,
  inject,
  effect,
  computed,
  viewChild,
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
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { EmailsService } from "src/app/api/emails/emails.service";
import { MultiFactorAuthService } from "../multi-factor-auth.service";
import { FormErrorComponent } from "../../../shared/forms/form-error/form-error.component";
import { BackupCodesComponent } from "./backup-codes/backup-codes.component";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { mapFormErrors } from "src/app/shared/forms/form.utils";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";

@Component({
  selector: "gt-totp",
  templateUrl: "./totp.component.html",
  styleUrls: ["./totp.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SettingsSectionComponent,
    MatButtonModule,
    MatStepperModule,
    MatDialogModule,
    BackupCodesComponent,
    ReactiveFormsModule,
    FormErrorComponent,
    MatFormFieldModule,
    MatInputModule,
    LoadingButtonComponent,
  ],
})
export class TOTPComponent implements OnDestroy {
  private service = inject(MultiFactorAuthService);
  private dialog = inject(MatDialog);
  protected emailsService = inject(EmailsService);

  @ViewChild("canvas", { static: false }) canvas: ElementRef | undefined;
  private readonly firstStepTitle =
    viewChild<ElementRef<HTMLElement>>("firstStepTitle");
  TOTPAuthenticator = this.service.TOTPAuthenticator;
  totp = this.service.totp;
  step = this.service.setupTOTPStage;
  // Setup stage 2/3/4 maps to stepper step 0/1/2.
  // Capped at the last step: the stage moves past it for a moment after the
  // app is enabled, before the page switches to the enabled view.
  stepperIndex = computed(() => Math.min(2, Math.max(0, this.step() - 2)));
  formErrors = this.service.formErrors;
  loading = this.service.loading;
  pendingAction = this.service.pendingAction;
  codeForm = new FormGroup({
    code: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  constructor() {
    effect(() => {
      const totp = this.totp();
      if (totp) {
        this.generateQRCode(totp.totpUrl);
      }
    });
    // Set up's button goes away as the stepper appears. Later steps need
    // nothing: the stepper focuses the new step's header itself.
    effect(() => this.firstStepTitle()?.nativeElement.focus());
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

  async enableTOTP() {
    const code = this.code?.value;
    if (this.codeForm.valid && code) {
      await this.service.activateTOTP(code);
      mapFormErrors(this.service.fieldErrors(), this.codeForm);
    }
  }

  deactivateTOTP() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Turn off the authenticator app?`,
          message: $localize`Signing in will no longer ask for a code from it.`,
          confirmText: $localize`Turn off`,
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

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  effect,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";

import { MultiFactorAuthService } from "../../multi-factor-auth.service";
import { FormErrorComponent } from "../../../../shared/forms/form-error/form-error.component";

@Component({
  selector: "gt-backup-codes",
  templateUrl: "./backup-codes.component.html",
  styleUrls: ["./backup-codes.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    FormErrorComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class BackupCodesComponent {
  private service = inject(MultiFactorAuthService);
  private snackBar = inject(MatSnackBar);

  TOTPAuthenticator = this.service.TOTPAuthenticator;
  error = this.service.error;
  copiedCodes = this.service.copiedCodes;
  regenCodes = this.service.regenCodes;
  backupCodeForm = new FormGroup({
    backupCode: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
  });

  constructor() {
    effect(() => this.backupCode?.setErrors({ serverError: [this.error()] }));
  }

  get backupCode() {
    return this.backupCodeForm.get("backupCode");
  }

  startRegenCodes() {
    this.service.regenerateRecoveryCodes();
  }

  copyCodes() {
    const codes = this.service.codes();
    if (codes) {
      navigator.clipboard.writeText(codes.join("\n"));
      this.service.setCopiedCodes();
      this.snackBar.open("Backup codes copied to clipboard.");
    }
  }

  downloadCodes() {
    this.download("glitchtip-backup.txt", this.service.codes().join("\n"));
    this.service.setCopiedCodes();
  }

  verifyBackupCode() {
    const code = this.backupCodeForm.get("backupCode")?.value;
    if (this.backupCodeForm.valid && code) {
      this.service.setRecoveryCodes(code);
    }
  }

  private download(filename: string, text: string) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}

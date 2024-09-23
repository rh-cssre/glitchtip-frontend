import { Component, ChangeDetectionStrategy } from "@angular/core";
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
import { lastValueFrom } from "rxjs";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: "gt-backup-codes",
  templateUrl: "./backup-codes.component.html",
  styleUrls: ["./backup-codes.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    FormErrorComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class BackupCodesComponent {
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

  constructor(
    private service: MultiFactorAuthService,
    private snackBar: MatSnackBar,
  ) {
    toObservable(this.error).subscribe((error) =>
      this.backupCode?.setErrors({ serverError: [error] }),
    );
  }

  get backupCode() {
    return this.backupCodeForm.get("backupCode");
  }

  startRegenCodes() {
    lastValueFrom(this.service.regenerateRecoveryCodes());
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
      lastValueFrom(this.service.setRecoveryCodes(code));
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

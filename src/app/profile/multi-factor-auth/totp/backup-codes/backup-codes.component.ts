import {
  Component,
  ChangeDetectionStrategy
} from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { MultiFactorAuthService } from "../../multi-factor-auth.service";

@Component({
  selector: "gt-backup-codes",
  templateUrl: "./backup-codes.component.html",
  styleUrls: ["./backup-codes.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackupCodesComponent {
  TOTPKey$ = this.service.TOTPKey$;
  error$ = this.service.serverError$;
  copiedCodes$ = this.service.copiedCodes$;
  regenCodes$ = this.service.regenCodes$;
  backupCodeForm = new UntypedFormGroup({
    backupCode: new UntypedFormControl("", [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
    ]),
  });

  constructor(
    private service: MultiFactorAuthService,
    private snackBar: MatSnackBar
    ) {}

  get backupCode() {
    return this.backupCodeForm.get("backupCode");
  }

  startRegenCodes() {
    this.service.setRegenCodes();
  }

  copyCodes() {
    this.service.backupCodes$.pipe(take(1)).subscribe((codes) => {
      if (codes) {
        navigator.clipboard.writeText(codes.join("\n"));
        this.service.setCopiedCodes();
        this.snackBar.open("Backup codes copied to clipboard.");
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

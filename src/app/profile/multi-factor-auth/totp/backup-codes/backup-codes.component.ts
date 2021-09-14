import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy 
} from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
// import { combineLatest } from "rxjs";
import { take } from "rxjs/operators";
import { MultiFactorAuthService } from "../../multi-factor-auth.service";

@Component({
  selector: 'gt-backup-codes',
  templateUrl: './backup-codes.component.html',
  styleUrls: ['./backup-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackupCodesComponent implements OnInit {
  TOTPKey$ = this.service.TOTPKey$;
  error$ = this.service.serverError$;
  copiedCodes$ = this.service.copiedCodes$;
  backupCodeForm = new FormGroup({
    backupCode: new FormControl("", [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
    ]),
  });

  constructor(private service: MultiFactorAuthService) { }

  get backupCode() {
    return this.backupCodeForm.get("backupCode");
  }

  ngOnInit(): void {
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

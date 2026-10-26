import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { FormErrorComponent } from "../../../shared/forms/form-error/form-error.component";
import { EmailsService } from "src/app/api/emails/emails.service";
import { MultiFactorAuthService } from "../multi-factor-auth.service";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";

@Component({
  selector: "gt-webauthn",
  templateUrl: "./webauthn.component.html",
  styleUrls: ["./webauthn.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormErrorComponent,
    LoadingButtonComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    ListComponent,
    ListRowComponent,
    SettingsSectionComponent,
  ],
})
export class WebAuthnComponent {
  deleteKeyLabel = (name: string) => $localize`Remove ${name}:name:`;
  private service = inject(MultiFactorAuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  protected emailsService = inject(EmailsService);

  stage = this.service.webAuthnState;
  hasTOTP = this.service.TOTPAuthenticator;
  error: string | null = null;
  authenticators = this.service.webAuthnAuthenticators;
  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });
  get name() {
    return this.form.get("name");
  }
  activateWebAuthn() {
    this.service.getWebauthn();
  }
  async registerWebAuthn() {
    const name = this.name?.value;
    if (this.form.valid && name) {
      await this.service.addWebAuthn(name);
      this.snackBar.open($localize`Your security key has been registered.`);
    }
  }
  deleteWebAuthn(id: number, name: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Remove ${name}:name:?`,
          message: $localize`You will no longer sign in with this key.`,
          confirmText: $localize`Remove`,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.service.deleteWebAuthn(id);
      });
  }

  lastUsedLabel(lastUsed?: number) {
    if (!lastUsed) return $localize`Not used yet`;
    const date = new Date(lastUsed * 1000).toLocaleDateString();
    return $localize`Last used ${date}:date:`;
  }
}

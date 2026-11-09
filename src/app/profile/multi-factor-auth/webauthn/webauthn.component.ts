import {
  Component,
  ChangeDetectionStrategy,
  LOCALE_ID,
  inject,
  signal,
} from "@angular/core";
import { formatDate } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { EmailsService } from "src/app/api/emails/emails.service";
import { MultiFactorAuthService } from "../multi-factor-auth.service";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";

@Component({
  selector: "gt-webauthn",
  templateUrl: "./webauthn.component.html",
  styleUrls: ["./webauthn.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingButtonComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ListComponent,
    ListRowComponent,
    SettingsSectionComponent,
    EmptyStateComponent,
    FormErrorComponent,
  ],
})
export class WebAuthnComponent {
  deleteKeyLabel = (name: string) => $localize`Remove ${name}:name:`;
  private service = inject(MultiFactorAuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private locale = inject(LOCALE_ID);
  protected emailsService = inject(EmailsService);

  stage = this.service.webAuthnState;
  hasTOTP = this.service.TOTPAuthenticator;
  authenticators = this.service.webAuthnAuthenticators;
  error = this.service.webAuthnError;
  loading = this.service.loading;
  pendingAction = this.service.pendingAction;
  removingId = signal<number | null>(null);
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
        if (confirmed) {
          this.removingId.set(id);
          this.service.deleteWebAuthn(id);
        }
      });
  }

  lastUsedLabel(lastUsed?: number) {
    if (!lastUsed) return $localize`Not used yet`;
    // Same format as other dates in settings ("Oct 25, 2026").
    const date = formatDate(lastUsed * 1000, "mediumDate", this.locale);
    return $localize`Last used ${date}:date:`;
  }
}

import { Component, ChangeDetectionStrategy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { lastValueFrom, tap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { FormErrorComponent } from "../../../shared/forms/form-error/form-error.component";
import { MultiFactorAuthService } from "../multi-factor-auth.service";
import { checkForOverflow } from "src/app/shared/shared.utils";

@Component({
  selector: "gt-webauthn",
  templateUrl: "./webauthn.component.html",
  styleUrls: ["./webauthn.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    FormErrorComponent,
    LoadingButtonComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class WebAuthnComponent {
  stage = this.service.webAuthnState;
  hasTOTP = this.service.TOTPAuthenticator;
  error = null;
  authenticators = this.service.webAuthnAuthenticators;
  tooltipDisabled = false;
  // TOTPKey$ = this.service.TOTPKey$;
  // FIDO2Keys$ = this.service.FIDO2Keys$;
  // setupFIDO2Stage$ = this.service.setupFIDO2Stage$;
  // error$ = this.service.serverError$;
  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });
  constructor(
    private service: MultiFactorAuthService,
    private snackBar: MatSnackBar,
  ) {}
  get name() {
    return this.form.get("name");
  }
  activateWebAuthn() {
    lastValueFrom(this.service.getWebauthn());
  }
  registerWebAuthn() {
    const name = this.name?.value;
    if (this.form.valid && name) {
      lastValueFrom(
        this.service
          .addWebAuthn(name)
          .pipe(
            tap(() =>
              this.snackBar.open(
                $localize`Your security key has been registered.`,
              ),
            ),
          ),
      );
    }
  }
  deleteWebAuthn(id: number) {
    lastValueFrom(this.service.deleteWebAuthn(id));
  }
  formatDate(lastUsed?: number) {
    if (lastUsed) {
      const date = new Date(lastUsed * 1000);
      return date.toLocaleDateString();
    } else {
      return "Not yet used";
    }
  }
  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}

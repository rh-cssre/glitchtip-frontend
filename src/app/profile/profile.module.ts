import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";

import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile.component";
import { SharedModule } from "../shared/shared.module";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ManageEmailsComponent } from "./manage-emails/manage-emails.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { AuthTokensComponent } from "./auth-tokens/auth-tokens.component";
import { NewTokenComponent } from "./auth-tokens/new-token/new-token.component";
import { SocialAuthComponent } from "./social-auth/social-auth.component";
import { AccountComponent } from "./account/account.component";
import { MultiFactorAuthComponent } from "./multi-factor-auth/multi-factor-auth.component";
import { TOTPComponent } from "./multi-factor-auth/totp/totp.component";
import { Fido2Component } from "./multi-factor-auth/fido2/fido2.component";
import { BackupCodesComponent } from "./multi-factor-auth/totp/backup-codes/backup-codes.component";
import { WizardComponent } from "./wizard/wizard.component";

@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    ManageEmailsComponent,
    ConfirmEmailComponent,
    NotificationsComponent,
    AuthTokensComponent,
    NewTokenComponent,
    SocialAuthComponent,
    AccountComponent,
    MultiFactorAuthComponent,
    TOTPComponent,
    Fido2Component,
    BackupCodesComponent,
    WizardComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatChipsModule,
  ],
})
export class ProfileModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";


import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile.component";
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
import { PreferencesComponent } from "./preferences/preferences.component";
import { CopyInputComponent } from "../shared/copy-input/copy-input.component";
import { AuthSvgComponent } from "../shared/auth-svg/auth-svg.component";
import { InputMatcherDirective } from "../shared/input-matcher.directive";
import { LoadingButtonComponent } from "../shared/loading-button/loading-button.component";
import { ToDoItemComponent } from "../shared/to-do-item/to-do-item.component";
import { FormErrorComponent } from "../shared/forms/form-error/form-error.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { LessAnnoyingErrorStateMatcherModule } from "../shared/less-annoying-error-state-matcher.module";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
    imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    CopyInputComponent,
    AuthSvgComponent,
    InputMatcherDirective,
    LoadingButtonComponent,
    ToDoItemComponent,
    FormErrorComponent,
    LessAnnoyingErrorStateMatcherModule,
    MatDividerModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule,
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
    PreferencesComponent,
],
})
export class ProfileModule {}

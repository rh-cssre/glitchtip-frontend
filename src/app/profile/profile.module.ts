import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile.component";
import { SharedModule } from "../shared/shared.module";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ManageEmailsComponent } from "./manage-emails/manage-emails.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";
import { AuthTokensComponent } from "./auth-tokens/auth-tokens.component";
import { NewTokenComponent } from "./auth-tokens/new-token/new-token.component";

@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    ManageEmailsComponent,
    ConfirmEmailComponent,
    AuthTokensComponent,
    NewTokenComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
})
export class ProfileModule {}

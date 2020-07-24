import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile.component";
import { SharedModule } from "../shared/shared.module";
import { AuthButtonComponent } from "./auth-button/auth-button.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ManageEmailsComponent } from "./manage-emails/manage-emails.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";

@NgModule({
  declarations: [
    ProfileComponent,
    AuthButtonComponent,
    ChangePasswordComponent,
    ManageEmailsComponent,
    ConfirmEmailComponent,
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

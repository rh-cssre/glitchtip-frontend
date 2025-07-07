import { Component, OnDestroy, inject } from "@angular/core";
import { UserService } from "src/app/api/user/user.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { ManageEmails } from "../manage-emails/manage-emails";
import { SocialAuthComponent } from "../social-auth/social-auth.component";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { PreferencesComponent } from "../preferences/preferences.component";
import { AuthService } from "src/app/auth.service";

@Component({
  selector: "gt-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
  imports: [
    PreferencesComponent,
    ChangePasswordComponent,
    SocialAuthComponent,
    ManageEmails,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    LoadingButtonComponent,
  ],
})
export class AccountComponent implements OnDestroy {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  userDeleteLoading = this.userService.userDeleteLoading;
  userDeleteError = this.userService.userDeleteError;

  deleteUser() {
    if (
      window.confirm(
        `Are you sure you want to delete your user account? You will permanently lose access to all organizations, projects, and teams associated with it.`,
      )
    ) {
      this.userService.deleteUser().then((result) => {
        this.authService.expireAuth();
        window.location.href = "/login";
      });
    }
  }

  ngOnDestroy(): void {
    this.userService.clearUserUIState();
  }
}

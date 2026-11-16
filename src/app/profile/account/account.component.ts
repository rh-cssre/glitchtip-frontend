import {
  Component,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { UserService } from "src/app/api/user/user.service";
import { FormErrorComponent } from "src/app/shared/forms/form-error/form-error.component";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { ManageEmails } from "../manage-emails/manage-emails";
import { SocialAuthComponent } from "../social-auth/social-auth.component";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { PreferencesComponent } from "../preferences/preferences.component";
import { AuthService } from "src/app/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";

@Component({
  selector: "gt-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    PreferencesComponent,
    ChangePasswordComponent,
    SocialAuthComponent,
    ManageEmails,
    FormErrorComponent,
    LoadingButtonComponent,
    SettingsSectionComponent,
  ],
})
export class AccountComponent implements OnDestroy {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  userDeleteLoading = this.userService.userDeleteLoading;
  userDeleteError = this.userService.userDeleteError;

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete account?`,
        message: $localize`You lose access to every organization you belong to. This cannot be undone.`,
        confirmText: $localize`Delete`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser().then((result) => {
          if (result) {
            this.authService.expireAuth();
            window.location.href = "/login";
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.userService.clearUserUIState();
  }
}

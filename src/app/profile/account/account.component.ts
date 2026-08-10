import {
  Component,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
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
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";

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
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    LoadingButtonComponent,
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
        message: $localize`Are you sure you want to delete your user account? You will permanently lose access to all organizations, projects, and teams associated with it.`,
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

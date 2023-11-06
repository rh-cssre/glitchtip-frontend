import { Component, OnDestroy } from "@angular/core";
import { lastValueFrom, tap } from "rxjs";
import { AuthService } from "src/app/api/auth/auth.service";
import { UserService } from "src/app/api/user/user.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgIf, AsyncPipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { ManageEmailsComponent } from "../manage-emails/manage-emails.component";
import { SocialAuthComponent } from "../social-auth/social-auth.component";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { PreferencesComponent } from "../preferences/preferences.component";

@Component({
  selector: "gt-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
  standalone: true,
  imports: [
    PreferencesComponent,
    ChangePasswordComponent,
    SocialAuthComponent,
    ManageEmailsComponent,
    MatCardModule,
    MatDividerModule,
    NgIf,
    MatFormFieldModule,
    LoadingButtonComponent,
    AsyncPipe,
  ],
})
export class AccountComponent implements OnDestroy {
  userDeleteLoading$ = this.userService.userDeleteLoading$;
  userDeleteError$ = this.userService.userDeleteError$;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  deleteUser() {
    if (
      window.confirm(
        `Are you sure you want to delete your user account? You will permanently lose access to all organizations, projects, and teams associated with it.`
      )
    ) {
      lastValueFrom(
        this.userService
          .deleteUser()
          .pipe(tap(() => this.authService.removeAuth())),
        { defaultValue: null }
      );
    }
  }

  ngOnDestroy(): void {
    this.userService.clearUserUIState();
  }
}

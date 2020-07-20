import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { UserService } from "../api/user/user.service";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { SettingsService } from "../api/settings.service";
import { SocialApp } from "../api/user/user.interfaces";
import { AuthService } from "../api/auth/auth.service";
import { map, take, mergeMap, tap } from "rxjs/operators";
import { EMPTY } from "rxjs";

@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  user$ = this.userService.userDetails$;
  socialApps$ = this.settingsService.socialApps$;
  passwordResetLoading = false;
  passwordResetSuccess = false;
  account = new FormControl();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private oauthService: GlitchTipOAuthService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.userService.getUserDetails();
    this.passwordResetSuccess = false;
    this.passwordResetLoading = false;
  }

  addAccount() {
    // No connection for GitHub because it doesn't allow for multiple redirect URI's
    // Can connect to GitHub on the log in page
    const socialApp: SocialApp = this.account.value;
    switch (socialApp.provider) {
      case "gitlab":
        return this.oauthService.initGitlabLogin(socialApp.client_id);
      case "google":
        return this.oauthService.initGoogleLogin(socialApp.client_id);
      case "microsoft":
        return this.oauthService.initMicrosoftLogin(socialApp.client_id);
      case "github":
        return this.oauthService.initGitlabLogin(socialApp.client_id);
    }
  }

  disconnect(socialAccountId: number) {
    this.userService.disconnectSocialAccount(socialAccountId);
  }

  passwordReset() {
    this.passwordResetSuccess = false;
    this.passwordResetLoading = true;
    this.user$
      .pipe(
        map((user) => user?.email),
        take(1),
        mergeMap((email) => {
          if (email) {
            return this.authService.passwordReset(email).pipe(
              tap(() => {
                this.passwordResetSuccess = true;
                this.passwordResetLoading = false;
              })
            );
          }
          return EMPTY;
        })
      )
      .toPromise();
  }
}

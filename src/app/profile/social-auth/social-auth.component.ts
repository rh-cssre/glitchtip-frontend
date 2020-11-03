import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { GlitchTipOAuthService } from "src/app/api/oauth/oauth.service";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { SocialApp } from "../../api/user/user.interfaces";

@Component({
  selector: "app-social-auth",
  templateUrl: "./social-auth.component.html",
  styleUrls: ["./social-auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAuthComponent implements OnInit {
  user$ = this.userService.userDetails$;
  disconnectLoading$ = this.userService.disconnectLoading$;
  socialApps$ = this.settingsService.socialApps$;
  account = new FormControl();

  constructor(
    private userService: UserService,
    private oauthService: GlitchTipOAuthService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.userService.getUserDetails();
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
        return this.oauthService.initGithubLogin(socialApp.client_id);
    }
  }

  disconnect(socialAccountId: number) {
    this.userService.disconnectSocialAccount(socialAccountId);
  }
}

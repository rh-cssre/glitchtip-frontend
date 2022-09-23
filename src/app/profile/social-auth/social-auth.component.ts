import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { GlitchTipOAuthService } from "src/app/api/oauth/oauth.service";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { SocialApp } from "../../api/user/user.interfaces";

@Component({
  selector: "gt-social-auth",
  templateUrl: "./social-auth.component.html",
  styleUrls: ["./social-auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAuthComponent implements OnInit {
  user$ = this.userService.userDetails$;
  disconnectLoading$ = this.userService.disconnectLoading$;
  socialApps$ = this.settingsService.socialApps$;
  account = new UntypedFormControl();

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
    this.oauthService.initOAuthLogin(socialApp);
  }

  disconnect(socialAccountId: number) {
    this.userService.disconnectSocialAccount(socialAccountId);
  }
}

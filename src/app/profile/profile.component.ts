import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UserService } from "../api/user/user.service";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";

@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  user$ = this.userService.userDetails$;
  isGoogleConnected$ = this.userService.isGoogleConnected$;
  isMicrosoftConnected$ = this.userService.isMicrosoftConnected$;
  isGitlabConnected$ = this.userService.isGitlabConnected$;
  isGithubConnected$ = this.userService.isGithubConnected$;
  constructor(
    private userService: UserService,
    private oauthService: GlitchTipOAuthService
  ) {}

  ngOnInit(): void {
    this.userService.getUserDetails();
  }

  // No connection for GitHub because it doesn't allow for multiple redirect URI's
  // Can connect to GitHub on the log in page

  connectGitlab() {
    this.oauthService.initGitlabConnect();
  }

  connectGoogle() {
    this.oauthService.initGoogleConnect();
  }

  connectMicrosoft() {
    this.oauthService.initMicrosoftConnect();
  }
}

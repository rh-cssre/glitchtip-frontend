import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UserService } from "../api/user/user.service";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";

@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  connectGoogle() {
    this.oauthService.initGoogleConnect();
  }
}

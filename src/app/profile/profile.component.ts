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

  connectGithub() {
    console.log("TODO: connect Github logic");
  }

  disconnectGithub() {
    console.log("TODO: disconnect GitHub logic");
  }

  connectGitlab() {
    console.log("TODO: connect GitLab logic");
  }

  disconnectGitlab() {
    console.log("TODO: disconnect GitLab logic");
  }

  connectGoogle() {
    this.oauthService.initGoogleConnect();
  }

  disconnectGoogle() {
    console.log("TODO: disconnect Google logic");
  }

  connectMicrosoft() {
    console.log("TODO: connect Microsoft logic");
  }

  disconnectMicrosoft() {
    console.log("TODO: disconnect Microsoft logic");
  }
}

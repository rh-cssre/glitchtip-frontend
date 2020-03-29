import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UserService } from "../api/user/user.service";

@Component({
  selector: "app-profile",
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
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserDetails();
  }
}

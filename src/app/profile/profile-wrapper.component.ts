import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { UserService } from "../api/user/user.service";
import { TopAppBar } from "../shared/top-app-bar/top-app-bar";

@Component({
  selector: "gt-profile",
  templateUrl: "./profile-wrapper.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, TopAppBar],
})
export class ProfilWrapperComponent {
  private userService = inject(UserService);

  user = this.userService.user;
}

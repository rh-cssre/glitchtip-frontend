import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MainNavComponent } from "./main-nav/main-nav/main-nav.component";

@Component({
  selector: "gt-logged-in",
  templateUrl: "./logged-in.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MainNavComponent, RouterOutlet],
})
export class LoggedInComponent {
  // The current user is loaded reactively by UserService.userResource (keyed on
  // AuthService.isAuthenticated), so this shell no longer fetches it explicitly
  // on init — doing so duplicated GET /api/0/users/me/ on every app load.
}

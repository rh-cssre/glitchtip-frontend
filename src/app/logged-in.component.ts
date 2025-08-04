import { Component, OnInit, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MainNavComponent } from "./main-nav/main-nav/main-nav.component";
import { RateLimitBannerComponent } from "./rate-limit-banner/rate-limit-banner.component";
import { UserService } from "./api/user/user.service";

@Component({
  selector: "gt-logged-in",
  templateUrl: "./logged-in.component.html",
  imports: [MainNavComponent, RouterOutlet, RateLimitBannerComponent],
})
export class LoggedInComponent implements OnInit {
  private userService = inject(UserService);

  ngOnInit() {
    // this.organizationService.retrieveOrganizations().subscribe();
    this.userService.getUserDetails();
  }
}

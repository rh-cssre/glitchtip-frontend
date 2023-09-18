import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MainNavComponent } from "./main-nav/main-nav/main-nav.component";
import { RateLimitBannerComponent } from "./rate-limit-banner/rate-limit-banner.component";
import { OrganizationsService } from "./api/organizations/organizations.service";
import { UserService } from "./api/user/user.service";

@Component({
  selector: "gt-logged-in",
  templateUrl: "./logged-in.component.html",
  standalone: true,
  imports: [MainNavComponent, RouterOutlet, RateLimitBannerComponent],
})
export class LoggedInComponent implements OnInit {
  constructor(
    private userService: UserService,
    private organizationService: OrganizationsService
  ) {}

  ngOnInit() {
    this.organizationService.retrieveOrganizations().subscribe();
    this.userService.getUserDetails();
  }
}

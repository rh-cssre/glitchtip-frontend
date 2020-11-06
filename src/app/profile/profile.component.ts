import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../api/auth/auth.service";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { UserService } from "../api/user/user.service";
import { MainNavService } from "../main-nav/main-nav.service";
import { tap, filter, map } from "rxjs/operators";

@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {
  user$ = this.userService.userDetails$;
  isLoggedIn$ = this.auth.isLoggedIn;
  activeOrganizationDetail$ = this.organizationService
    .activeOrganizationDetail$;

  constructor(
    private userService: UserService,
    private mainNav: MainNavService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private organizationService: OrganizationsService
  ) {
    this.route.params
      .pipe(
        map((params) => params["org-slug"]),
        filter((orgSlug: string) => orgSlug !== undefined),
        tap((orgSlug) =>
          this.organizationService.setActiveOrganizationFromRouteChange(orgSlug)
        )
      )
      .subscribe();
  }

  toggleSideNav() {
    this.mainNav.getToggleNav();
  }
}

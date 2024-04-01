import { Component } from "@angular/core";
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { AuthService } from "../api/auth/auth.service";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { UserService } from "../api/user/user.service";
import { MainNavService } from "../main-nav/main-nav.service";
import { tap, filter, map } from "rxjs/operators";
import { MobileNavToolbarComponent } from "../mobile-nav-toolbar/mobile-nav-toolbar.component";
import { NgIf, AsyncPipe } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";

@Component({
  selector: "gt-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    NgIf,
    MobileNavToolbarComponent,
    RouterOutlet,
    AsyncPipe,
  ],
})
export class ProfileComponent {
  user$ = this.userService.userDetails$;
  isLoggedIn$ = this.auth.isLoggedIn;
  activeOrganizationDetail$ =
    this.organizationService.activeOrganizationDetail$;

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

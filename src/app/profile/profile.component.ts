import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MobileNavToolbarComponent } from "../mobile-nav-toolbar/mobile-nav-toolbar.component";
import { AuthService } from "../auth.service";
import { UserService } from "../api/user/user.service";
import { MainNavService } from "../main-nav/main-nav.service";
import { OrganizationsService } from "../api/organizations.service";

@Component({
  selector: "gt-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  imports: [
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MobileNavToolbarComponent,
    RouterOutlet,
  ],
})
export class ProfileComponent {
  private userService = inject(UserService);
  private mainNav = inject(MainNavService);
  private auth = inject(AuthService);
  private organizationService = inject(OrganizationsService);

  user = this.userService.user;
  isLoggedIn = this.auth.isAuthenticated;
  activeOrganization = this.organizationService.activeOrganization;

  toggleSideNav() {
    this.mainNav.getToggleNav();
  }
}

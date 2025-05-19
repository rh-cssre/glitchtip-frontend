import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { SettingsService } from "src/app/api/settings.service";
import { MainNavService } from "src/app/main-nav/main-nav.service";
import { MobileNavToolbarComponent } from "../../mobile-nav-toolbar/mobile-nav-toolbar.component";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthService } from "src/app/auth.service";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  selector: "gt-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  imports: [
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MobileNavToolbarComponent,
    RouterOutlet,
  ],
})
export class SettingsComponent {
  private service = inject(SettingsService);
  private organizationService = inject(OrganizationsService);
  private auth = inject(AuthService);
  private mainNav = inject(MainNavService);

  billingEnabled = this.service.billingEnabled;
  organizationSlug = this.organizationService.activeOrganizationSlug;
  isLoggedIn = this.auth.isAuthenticated;
  activeOrganizationDetail = this.organizationService.activeOrganization;

  toggleSideNav() {
    this.mainNav.getToggleNav();
  }
}

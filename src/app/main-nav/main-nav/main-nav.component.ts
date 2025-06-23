import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  inject,
  computed,
} from "@angular/core";
import { MatMenuTrigger, MatMenuModule } from "@angular/material/menu";
import { MainNavService } from "../main-nav.service";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { MobileNavToolbarComponent } from "../../mobile-nav-toolbar/mobile-nav-toolbar.component";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthService } from "src/app/auth.service";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  selector: "gt-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    RouterLinkActive,
    MatCardModule,
    MobileNavToolbarComponent,
  ],
})
export class MainNavComponent {
  private mainNav = inject(MainNavService);
  private organizationsService = inject(OrganizationsService);
  private auth = inject(AuthService);
  private settingsService = inject(SettingsService);
  private userService = inject(UserService);

  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
  /* TODO: Add primary color to mat-sidenav
  https://stackoverflow.com/questions/54248944/angular-6-7-how-to-apply-default-theme-color-to-mat-sidenav-background */
  activeOrganization = this.organizationsService.activeOrganization;
  organizations = this.organizationsService.organizations;
  organizationsInitialLoad = this.organizationsService.initialLoad;
  isLoggedIn = this.auth.isAuthenticated;
  navOpen = this.mainNav.navOpen;
  billingEnabled = this.settingsService.billingEnabled;
  paidForGlitchTip = this.settingsService.paidForGlitchTip;
  mobileNav = this.mainNav.mobileNav;
  version = this.settingsService.version;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined = undefined;

  contextLoaded = computed(
    () =>
      this.settingsService.initialLoad() &&
      this.organizationsInitialLoad() &&
      !!this.userService.user(),
  );

  canCreateOrg = computed(
    () =>
      this.settingsService.enableOrganizationCreation() ||
      this.userService.user() ||
      this.organizationsService.organizationsCount(),
  );

  async logout() {
    await this.auth.logout();
    window.location.href = "/login";
  }

  toggleSideNav() {
    this.mainNav.getToggleNav();
  }

  closeSideNav() {
    this.mainNav.getClosedNav();
    this.trigger?.closeMenu();
  }

  setOrganization(slug: string) {
    this.organizationsService.setActiveOrganizationSlug(slug);
  }

  reload() {
    this.settingsService.reload();
    this.userService.reload();
    this.organizationsService.reload();
  }
}

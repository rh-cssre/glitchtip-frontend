import { Component, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { AuthService } from "src/app/api/auth/auth.service";
import { MainNavService } from "../main-nav.service";
import { SettingsService } from "src/app/api/settings.service";

@Component({
  selector: "gt-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavComponent {
  activeOrganizationLoaded = false;
  activeOrganizationSlug = "";
  /* TODO: Add primary color to mat-sidenav
  https://stackoverflow.com/questions/54248944/angular-6-7-how-to-apply-default-theme-color-to-mat-sidenav-background */
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  organizations$ = this.organizationsService.organizations$;
  organizationsInitialLoad$ = this.organizationsService.initialLoad$;
  isLoggedIn$ = this.auth.isLoggedIn;
  navOpen$ = this.mainNav.navOpen$;
  billingEnabled$ = this.settingsService.billingEnabled$;
  paidForGlitchTip$ = this.settingsService.paidForGlitchTip$;
  mobileNav$ = this.mainNav.mobileNav$;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined = undefined;

  constructor(
    private mainNav: MainNavService,
    private organizationsService: OrganizationsService,
    private auth: AuthService,
    private settingsService: SettingsService
  ) {
    this.organizationsService.activeOrganizationLoaded$.subscribe(
      (loaded) => (this.activeOrganizationLoaded = loaded)
    );
    this.activeOrganizationDetail$.subscribe(
      (organization) =>
        (this.activeOrganizationSlug = organization ? organization.slug : "")
    );
  }

  logout() {
    this.auth.logout();
  }

  toggleSideNav() {
    this.mainNav.getToggleNav();
  }

  closeSideNav() {
    this.mainNav.getClosedNav();
    this.trigger?.closeMenu();
  }

  setOrganization(id: number) {
    this.organizationsService.changeActiveOrganization(id);
  }
}

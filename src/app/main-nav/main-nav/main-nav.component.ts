import {
  Component,
  ChangeDetectionStrategy,
  HostListener
} from "@angular/core";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { AuthService } from "src/app/api/auth/auth.service";
import { MainNavService } from "../main-nav.service";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavComponent {
  innerWidth: number;
  sideNavOpen = true;
  /* TODO: Add primary color to mat-sidenav
  https://stackoverflow.com/questions/54248944/angular-6-7-how-to-apply-default-theme-color-to-mat-sidenav-background */
  activeOrganizationDetail$ = this.organizationsService
    .activeOrganizationDetail$;
  organizations$ = this.organizationsService.organizations$;
  isLoggedIn$ = this.auth.isLoggedIn;
  navOpen$ = this.mainNav.navOpen$;

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.isScreenSmall()) {
      this.hideSideNav();
    } else {
      this.showSideNav();
    }
  }

  constructor(
    private mainNav: MainNavService,
    private organizationsService: OrganizationsService,
    private auth: AuthService
  ) {
    this.innerWidth = window.innerWidth;
    if (this.isScreenSmall()) {
      this.hideSideNav();
    }
  }

  logout() {
    this.auth.logout();
  }

  isScreenSmall() {
    return this.innerWidth < 768;
  }

  toggleSideNav() {
    this.mainNav.getToggledNav();
  }

  hideSideNav() {
    this.mainNav.getClosedNav();
  }

  showSideNav() {
    this.mainNav.getOpenedNav();
  }

  setOrganization(id: number) {
    this.organizationsService.changeActiveOrganization(id);
  }
}

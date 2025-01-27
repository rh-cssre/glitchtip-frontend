import { Component, ChangeDetectionStrategy, ViewChild, inject } from "@angular/core";
import { MatMenuTrigger, MatMenuModule } from "@angular/material/menu";
import { combineLatest, firstValueFrom } from "rxjs";
import { map, tap } from "rxjs/operators";
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
import { AsyncPipe } from "@angular/common";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthService } from "src/app/auth.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import { toObservable } from "@angular/core/rxjs-interop";

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
    AsyncPipe,
  ],
})
export class MainNavComponent {
  private mainNav = inject(MainNavService);
  private organizationsService = inject(OrganizationsService);
  private auth = inject(AuthService);
  private settingsService = inject(SettingsService);
  private userService = inject(UserService);

  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
  activeOrganizationLoaded = this.organizationsService.activeOrganizationLoaded;
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

  contextLoaded$ = combineLatest([
    toObservable(this.settingsService.initialLoad),
    toObservable(this.organizationsInitialLoad),
    toObservable(this.userService.user),
  ]).pipe(
    map(([settingsLoaded, orgsLoaded, user]) => {
      return settingsLoaded && orgsLoaded && !!user;
    })
  );

  canCreateOrg$ = combineLatest([
    toObservable(this.userService.user),
    toObservable(this.organizationsService.organizationsCount),
    toObservable(this.settingsService.enableOrganizationCreation),
  ]).pipe(
    map(([user, orgCount, enableOrgCreation]) => {
      return enableOrgCreation || user?.isSuperuser || orgCount === 0;
    })
  );

  logout() {
    firstValueFrom(
      this.auth.logout().pipe(tap(() => (window.location.href = "/login")))
    );
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
  }
}

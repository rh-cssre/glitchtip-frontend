import { Component, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { MatMenuTrigger, MatMenuModule } from "@angular/material/menu";
import { combineLatest, firstValueFrom } from "rxjs";
import { map, tap } from "rxjs/operators";
import { OrganizationsService } from "../../api/organizations/organizations.service";
import { MainNavService } from "../main-nav.service";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { MobileNavToolbarComponent } from "../../mobile-nav-toolbar/mobile-nav-toolbar.component";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AsyncPipe } from "@angular/common";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthService } from "src/app/auth.service";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: "gt-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
    AsyncPipe
],
})
export class MainNavComponent {
  activeOrganizationLoaded = false;
  activeOrganizationSlug = "";
  /* TODO: Add primary color to mat-sidenav
  https://stackoverflow.com/questions/54248944/angular-6-7-how-to-apply-default-theme-color-to-mat-sidenav-background */
  activeOrganizationDetail$ =
    this.organizationsService.activeOrganizationDetail$;
  organizations$ = this.organizationsService.organizations$;
  organizationsInitialLoad$ = this.organizationsService.initialLoad$;
  isLoggedIn$ = toObservable(this.auth.isAuthenticated);
  navOpen$ = this.mainNav.navOpen$;
  billingEnabled$ = this.settingsService.billingEnabled$;
  paidForGlitchTip$ = this.settingsService.paidForGlitchTip$;
  mobileNav$ = this.mainNav.mobileNav$;
  version$ = this.settingsService.version$;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined = undefined;

  contextLoaded$ = combineLatest([
    this.settingsService.initialLoad$,
    this.organizationsInitialLoad$,
    this.userService.userDetails$,
  ]).pipe(
    map(([settingsLoaded, orgsLoaded, user]) => {
      return settingsLoaded && orgsLoaded && !!user;
    }),
  );

  canCreateOrg$ = combineLatest([
    this.userService.userDetails$,
    this.organizationsService.organizationCount$,
    this.settingsService.enableOrganizationCreation$,
  ]).pipe(
    map(([user, orgCount, enableOrgCreation]) => {
      return enableOrgCreation || user?.isSuperuser || orgCount === 0;
    }),
  );

  constructor(
    private mainNav: MainNavService,
    private organizationsService: OrganizationsService,
    private auth: AuthService,
    private settingsService: SettingsService,
    private userService: UserService,
    private router: Router,
  ) {
    this.organizationsService.activeOrganizationLoaded$.subscribe(
      (loaded) => (this.activeOrganizationLoaded = loaded),
    );
    this.activeOrganizationDetail$.subscribe(
      (organization) =>
        (this.activeOrganizationSlug = organization ? organization.slug : ""),
    );
  }

  logout() {
    firstValueFrom(
      this.auth.logout().pipe(tap(() => this.router.navigate(["/login"]))),
    );
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

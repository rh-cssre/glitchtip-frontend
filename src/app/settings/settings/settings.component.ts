import { Component } from "@angular/core";
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { tap, filter, map } from "rxjs/operators";
import { SettingsService } from "src/app/api/settings.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { MainNavService } from "src/app/main-nav/main-nav.service";
import { MobileNavToolbarComponent } from "../../mobile-nav-toolbar/mobile-nav-toolbar.component";
import { AsyncPipe } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthService } from "src/app/auth.service";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: "gt-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MobileNavToolbarComponent,
    RouterOutlet,
    AsyncPipe
],
})
export class SettingsComponent {
  billingEnabled$ = this.service.billingEnabled$;
  organizationSlug$ = this.organizationService.activeOrganizationSlug$;
  isLoggedIn$ = toObservable(this.auth.isAuthenticated);
  activeOrganizationDetail$ =
    this.organizationService.activeOrganizationDetail$;

  constructor(
    private service: SettingsService,
    private organizationService: OrganizationsService,
    private auth: AuthService,
    private mainNav: MainNavService,
    private route: ActivatedRoute,
  ) {
    this.route.params
      .pipe(
        map((params) => params["org-slug"]),
        filter((orgSlug: string) => orgSlug !== undefined),
        tap((orgSlug) =>
          this.organizationService.setActiveOrganizationFromRouteChange(
            orgSlug,
          ),
        ),
      )
      .subscribe();
  }

  toggleSideNav() {
    this.mainNav.getToggleNav();
  }
}

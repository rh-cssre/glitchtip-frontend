import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { tap, filter, map } from "rxjs/operators";
import { SettingsService } from "src/app/api/settings.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { AuthService } from "src/app/api/auth/auth.service";
import { MainNavService } from "src/app/main-nav/main-nav.service";

@Component({
  selector: "gt-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  billingEnabled$ = this.service.billingEnabled$;
  organizationSlug$ = this.organizationService.activeOrganizationSlug$;
  isLoggedIn$ = this.auth.isLoggedIn;
  activeOrganizationDetail$ = this.organizationService
    .activeOrganizationDetail$;

  constructor(
    private service: SettingsService,
    private organizationService: OrganizationsService,
    private auth: AuthService,
    private mainNav: MainNavService,
    private route: ActivatedRoute
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

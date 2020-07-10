import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../api/auth/auth.service";
import { OrganizationsService } from "../api/organizations/organizations.service";
import { SubscriptionsService } from "../api/subscriptions/subscriptions.service";
import { SettingsService } from "../api/settings.service";
import { combineLatest } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IsSubscribedGuard implements CanActivate {
  canActivateRoute = false;
  orgSlug: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private orgService: OrganizationsService,
    private subService: SubscriptionsService,
    private settingsService: SettingsService
  ) {
    combineLatest([
      this.settingsService.billingEnabled$,
      this.auth.isLoggedIn,
      this.orgService.activeOrganizationSlug$,
      this.subService.subscription$,
    ])
      .pipe()
      .subscribe(
        ([billingEnabled, isLoggedIn, activeOrgSlug, subscription]) => {
          this.orgSlug = activeOrgSlug;
          console.log(
            "can activate?",
            billingEnabled,
            isLoggedIn,
            activeOrgSlug,
            subscription?.status,
            billingEnabled &&
              isLoggedIn &&
              activeOrgSlug &&
              subscription &&
              Object.keys(subscription)
          );
          if (
            billingEnabled &&
            isLoggedIn &&
            activeOrgSlug &&
            subscription?.status
          ) {
            this.canActivateRoute = false;
          } else {
            this.canActivateRoute = true;
          }
        }
      );
  }
  canActivate() {
    if (!this.canActivateRoute) {
      this.router.navigate(["settings", this.orgSlug, "subscription"]);
      return false;
    }
    return true;
  }
}

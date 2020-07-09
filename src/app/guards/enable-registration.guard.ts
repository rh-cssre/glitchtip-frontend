import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SettingsService } from "../api/settings.service";

@Injectable({
  providedIn: "root",
})
export class EnableRegistrationGuard implements CanActivate {
  isRegistrationEnabled?: boolean;

  constructor(
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.settingsService.enableUserRegistration$.subscribe((enabled) => {
      this.isRegistrationEnabled = enabled;
    });
  }
  canActivate() {
    if (!this.isRegistrationEnabled) {
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  }
}

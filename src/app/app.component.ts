import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { AuthService } from "./api/auth/auth.service";
import { OrganizationsService } from "./api/organizations/organizations.service";
import { SettingsService } from "./api/settings.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = "glitchtip-frontend";
  isLoggedIn$ = this.auth.isLoggedIn;

  constructor(
    private auth: AuthService,
    private organizations: OrganizationsService,
    private settings: SettingsService
  ) {}

  ngOnInit() {
    this.settings.getSettings().subscribe();
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn === true) {
        this.organizations.retrieveOrganizations().toPromise();
      }
    });
  }
}

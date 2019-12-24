import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./api/auth/auth.service";
import { OrganizationsService } from "./api/organizations/organizations.service";

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
    private router: Router
  ) {}

  /**
   * Send user to login page or default org issues list
   */
  ngOnInit() {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn === false) {
        this.router.navigate(["login"]);
      } else {
        this.organizations.retrieveOrganizations().toPromise();
      }
    });
  }
}

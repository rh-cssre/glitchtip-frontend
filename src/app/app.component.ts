import { Component, OnInit } from "@angular/core";
import { Router, RoutesRecognized } from "@angular/router";
import { map, filter, take, exhaustMap, tap } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { AuthService } from "./api/auth/auth.service";
import { OrganizationsService } from "./api/organizations/organizations.service";
import { SettingsService } from "./api/settings.service";
import { UserService } from "./api/user/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  title = "glitchtip-frontend";
  isLoggedIn$ = this.auth.isLoggedIn;

  /**
   * Need RoutesRecognized to fire before retrieving organizations since doing
   * so relies on the organization slug to set the active org
   */
  routesAreRecognized$ = this.router.events.pipe(
    map((event) => {
      if (event instanceof RoutesRecognized) {
        return true;
      }
    }),
    filter((isRecognized) => !!isRecognized),
    take(1)
  );

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private organizations: OrganizationsService,
    private settings: SettingsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.settings.getSettings().subscribe();

    combineLatest([this.isLoggedIn$, this.routesAreRecognized$])
      .pipe(
        filter(([isLoggedIn, _]) => !!isLoggedIn),
        exhaustMap(() => this.organizations.retrieveOrganizations()),
        tap(() => this.userService.getUserDetails())
      )
      .subscribe();
  }
}

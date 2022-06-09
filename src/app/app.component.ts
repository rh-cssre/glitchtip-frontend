import { Component, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RoutesRecognized,
} from "@angular/router";
import { map, filter, take, exhaustMap, tap } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { AuthService } from "./api/auth/auth.service";
import { OrganizationsService } from "./api/organizations/organizations.service";
import { SettingsService } from "./api/settings.service";
import { UserService } from "./api/user/user.service";

@Component({
  selector: "gt-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
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
      return false;
    }),
    filter((isRecognized) => !!isRecognized),
    take(1)
  );

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private organizationService: OrganizationsService,
    private settings: SettingsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.settings.getSettings().subscribe();

    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized && event.state.root.firstChild) {
        const params = event.state.root.firstChild.params;
        const orgSlug = params["org-slug"];
        if (orgSlug !== undefined) {
          this.organizationService.setActiveOrganizationFromRouteChange(
            orgSlug
          );
        }
      }

      if (event instanceof NavigationEnd) {
        const params = this.route.snapshot.firstChild?.params;
        const orgSlug = params ? params["org-slug"] : undefined;
        this.settings.triggerPlausibleReport(orgSlug);
      }
    });

    combineLatest([this.isLoggedIn$, this.routesAreRecognized$])
      .pipe(
        filter(([isLoggedIn, _]) => !!isLoggedIn),
        exhaustMap(() => this.organizationService.retrieveOrganizations()),
        tap(() => this.userService.getUserDetails())
      )
      .subscribe();
  }
}

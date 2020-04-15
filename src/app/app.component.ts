import { Component, OnInit } from "@angular/core";
import { AuthService } from "./api/auth/auth.service";
import { OrganizationsService } from "./api/organizations/organizations.service";
import { SettingsService } from "./api/settings.service";
import { Router, RoutesRecognized } from "@angular/router";
import { BehaviorSubject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";

interface AppState {
  /** Don't get organizations until we know what's in the URL */
  routesRecognized: boolean;
  /** Only retrieve organizations one time */
  retrieveOrgsFiredOnce: boolean;
}

const initialState: AppState = {
  routesRecognized: false,
  retrieveOrgsFiredOnce: false,
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "glitchtip-frontend";
  isLoggedIn$ = this.auth.isLoggedIn;
  private readonly appState = new BehaviorSubject<AppState>(initialState);
  private readonly getState$ = this.appState.asObservable();
  /** When I had these two things broken out I had recursion problems */
  private readonly shouldRetrieveOrganizations$ = this.getState$.pipe(
    map(
      (data) =>
        data.routesRecognized === true && data.retrieveOrgsFiredOnce === false
    )
  );

  constructor(
    private auth: AuthService,
    private organizations: OrganizationsService,
    private settings: SettingsService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        this.setRoutesRecognized(true);
      }
    });
  }

  ngOnInit() {
    this.settings.getSettings().subscribe();
    combineLatest([
      this.isLoggedIn$,
      this.shouldRetrieveOrganizations$,
    ]).subscribe(([isLoggedIn, shouldRetrieveOrganizations]) => {
      if (isLoggedIn === true && shouldRetrieveOrganizations === true) {
        this.setRetrieveOrgsFiredOnce(true);
        this.organizations.retrieveOrganizations().toPromise();
      }
    });
  }

  private setRoutesRecognized(routesRecognized: boolean) {
    this.appState.next({
      ...this.appState.getValue(),
      routesRecognized,
    });
  }

  private setRetrieveOrgsFiredOnce(retrieveOrgsFiredOnce: boolean) {
    this.appState.next({
      ...this.appState.getValue(),
      retrieveOrgsFiredOnce,
    });
  }
}

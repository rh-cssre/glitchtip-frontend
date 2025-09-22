import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from "@angular/router";
import { filter, Subscription } from "rxjs";
import { OrganizationsService } from "../api/organizations.service";
import { SettingsService } from "../api/settings.service";
import { SubscriptionService } from "../api/subscriptions/subscription.service";

@Component({
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationFrameComponent implements OnDestroy, OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  settings = inject(SettingsService);
  subscription = inject(SubscriptionService);
  private firstChildRoute: string = "";
  private subscriptions: Subscription[] = [];
  private isNavigationFromBackButton = false;
  organizationService = inject(OrganizationsService);
  orgSlug = input.required<string>({ alias: "org-slug" });

  constructor() {
    effect(() => {
      const organizations = this.organizationService.organizations();
      const activeOrganizationSlug =
        this.organizationService.activeOrganizationSlug();
      const orgSlug = this.orgSlug();

      // Check if the organizations have loaded. If so, ensure the active organization slug
      // is valid.  If the current slug doesn't match any existing organization,
      // clear the active organization slug.
      if (
        this.organizationService.organizationsResource.hasValue() &&
        !organizations.find((org) => org.slug === activeOrganizationSlug)
      ) {
        this.organizationService.setActiveOrganizationSlug(null);
      }

      if (activeOrganizationSlug) {
        if (activeOrganizationSlug !== orgSlug) {
          if (this.isNavigationFromBackButton) {
            this.organizationService.setActiveOrganizationSlug(orgSlug);
          } else {
            this.router.navigate(
              ["../", activeOrganizationSlug, this.firstChildRoute],
              {
                relativeTo: this.route,
              },
            );
          }
        }
      } else {
        this.router.navigate(["/"]);
      }
    });

    effect(() => {
      const billingEnabled = this.settings.billingEnabled();
      const activeOrgSlug = this.organizationService.activeOrganizationSlug();
      if (billingEnabled && activeOrgSlug) {
        this.subscription.checkIfUserHasSubscription(activeOrgSlug);
      }
    });
  }

  ngOnInit() {
    this.extractFirstChildRoute();
    this.organizationService.setActiveOrganizationSlug(this.orgSlug());
    this.subscribeToRouteChanges();
  }

  ngOnDestroy() {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }

  private subscribeToRouteChanges() {
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe((event) => {
          this.isNavigationFromBackButton =
            (event as NavigationStart).navigationTrigger === "popstate";
          // The back button is synchronous. We must note and revert it back immediately after.
          setTimeout(() => (this.isNavigationFromBackButton = false));
        }),
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.extractFirstChildRoute();
        }),
    );
  }

  private extractFirstChildRoute() {
    const firstChild = this.route.firstChild;
    this.firstChildRoute = firstChild ? firstChild.snapshot.url[0]?.path : "";
  }
}

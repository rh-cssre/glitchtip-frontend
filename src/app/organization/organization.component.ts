import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  InputSignal,
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

@Component({
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationFrameComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  private firstChildRoute: string = "";
  private subscriptions: Subscription[] = [];
  private isNavigationFromBackButton = false;
  organizationService = inject(OrganizationsService);
  orgSlug: InputSignal<string> = input.required<string>({ alias: "org-slug" });

  constructor() {
    effect(() => {
      const activeOrgSlug = this.organizationService.activeOrganizationSlug();
      if (activeOrgSlug !== this.orgSlug()) {
        if (this.isNavigationFromBackButton) {
          this.organizationService.setActiveOrganizationSlug(this.orgSlug());
        } else {
          this.router.navigate(["../", activeOrgSlug, this.firstChildRoute], {
            relativeTo: this.route,
          });
        }
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
        })
    );
  }

  private extractFirstChildRoute() {
    const firstChild = this.route.firstChild;
    this.firstChildRoute = firstChild ? firstChild.snapshot.url[0]?.path : "";
  }
}

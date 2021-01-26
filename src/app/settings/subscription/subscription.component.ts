import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Subscription } from "rxjs";
import { map, filter } from "rxjs/operators";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { environment } from "../../../environments/environment";
import { StripeService } from "./stripe.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

@Component({
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionComponent implements OnDestroy {
  subscription$ = this.service.subscription$;
  eventsCount$ = this.service.eventsCount$;
  activeOrganizationSlug$ = this.orgService.activeOrganizationSlug$;
  projectsCount$ = this.orgService.projectsCount$;
  routerSubscription: Subscription;
  billingEmail = environment.billingEmail;
  totalEventsAllowed$ = this.subscription$.pipe(
    map((subscription) =>
      subscription && subscription.plan.product.metadata
        ? parseInt(subscription.plan.product.metadata.events, 10) - 1
        : null
    )
  );
  eventsPercent$ = combineLatest([
    this.totalEventsAllowed$,
    this.eventsCount$,
  ]).pipe(
    filter(([eventsAllowed, events]) => !!eventsAllowed && !!events),
    map(([eventsAllowed, events]) => (events! / eventsAllowed!) * 100)
  );

  constructor(
    private service: SubscriptionsService,
    private route: ActivatedRoute,
    private stripe: StripeService,
    private orgService: OrganizationsService
  ) {
    this.routerSubscription = this.route.params
      .pipe(
        map((params) => params["org-slug"] as string),
        filter((slug) => !!slug)
      )
      .subscribe((slug) => {
        this.service.retrieveSubscription(slug).toPromise();
        this.service.retrieveSubscriptionCount(slug).toPromise();
      });
  }

  manageSubscription() {
    this.stripe.redirectToBillingPortal();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.service.clearState();
  }
}

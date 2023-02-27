import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { combineLatest, lastValueFrom, Subscription } from "rxjs";
import { map, filter, take, tap } from "rxjs/operators";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { environment } from "../../../environments/environment";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { StripeService } from "./stripe.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";

interface Percentages {
  total: number;
  errorEvents: number;
  transactionEvents: number;
  uptimeEvents: number;
  fileSize: number;
}

@Component({
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionComponent implements OnDestroy {
  fromStripe$ = this.service.fromStripe$;
  subscription$ = this.service.subscription$;
  subscriptionLoading$ = this.service.subscriptionLoading$;
  subscriptionLoadingTimeout$ = this.service.subscriptionLoadingTimeout$;
  eventsCountWithTotal$ = this.service.eventsCountWithTotal$;
  activeOrganization$ = this.orgService.activeOrganization$;
  activeOrganizationSlug$ = this.orgService.activeOrganizationSlug$;
  promptForProject$ = combineLatest([
    this.orgService.activeOrganizationLoaded$,
    this.orgService.projectsCount$,
    this.service.subscription$,
  ]).pipe(
    map(([status, count, subscription]) => {
      if (subscription) {
        return status &&
          count === 0 &&
          subscription.status !== null &&
          subscription.status !== "canceled"
          ? true
          : false;
      } else {
        return false;
      }
    })
  );
  routerSubscription: Subscription;
  billingEmail = environment.billingEmail;
  error$ = this.stripe.error$;
  totalEventsAllowed$ = this.subscription$.pipe(
    map((subscription) =>
      subscription && subscription.plan?.product.metadata
        ? parseInt(subscription.plan.product.metadata.events, 10)
        : null
    )
  );
  eventsPercent$ = combineLatest([
    this.totalEventsAllowed$,
    this.eventsCountWithTotal$,
  ]).pipe(
    filter(([eventsAllowed, events]) => !!eventsAllowed && !!events),
    map(([eventsAllowed, events]) => {
      return <Percentages>{
        total: (events?.total! / eventsAllowed!) * 100,
        errorEvents: (events?.eventCount! / eventsAllowed!) * 100,
        transactionEvents:
          (events?.transactionEventCount! / eventsAllowed!) * 100,
        uptimeEvents: (events?.uptimeCheckEventCount! / eventsAllowed!) * 100,
        fileSize: (events?.fileSizeMB! / eventsAllowed!) * 100,
      };
    })
  );

  constructor(
    private service: SubscriptionsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private stripe: StripeService,
    private orgService: OrganizationsService
  ) {
    this.routerSubscription = combineLatest([
      this.route.params,
      this.route.queryParams,
    ])
      .pipe(
        map(([params, queryParams]) => {
          const slug = params["org-slug"] as string;
          const sessionId = queryParams["session_id"];
          return { slug, sessionId };
        }),
        filter((routerData) => !!routerData.slug),
        take(1)
      )
      .subscribe((routerData) => {
        if (routerData.sessionId) {
          this.service.retrieveUntilSubscriptionOrTimeout(routerData.slug);
        } else {
          this.service.retrieveSubscription(routerData.slug);
        }
        this.service.retrieveSubscriptionEventCount(routerData.slug);
      });
  }

  openEventInfoDialog() {
    this.dialog.open(EventInfoComponent, {
      maxWidth: "300px",
    });
  }

  manageSubscription() {
    lastValueFrom(
      this.activeOrganization$.pipe(
        filter((org) => !!org),
        tap((org) => this.stripe.redirectToBillingPortal(org!.id)),
        take(1)
      )
    );
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.service.clearState();
    this.stripe.clearState();
  }
}

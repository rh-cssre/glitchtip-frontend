import { Component, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { combineLatest, Subscription } from "rxjs";
import { map, filter } from "rxjs/operators";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { environment } from "../../../environments/environment";
import { StripeService } from "./stripe.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";

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
  subscription$ = this.service.subscription$;
  eventsCountWithTotal$ = this.service.eventsCountWithTotal$;
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

  openEventInfoDialog() {
    this.dialog.open(EventInfoComponent, {
      maxWidth: "300px",
    });
  }

  manageSubscription() {
    this.stripe.redirectToBillingPortal();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.service.clearState();
    this.stripe.clearState();
  }
}

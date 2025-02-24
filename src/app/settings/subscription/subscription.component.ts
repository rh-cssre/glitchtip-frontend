import { Component, ChangeDetectionStrategy, OnDestroy, computed, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { combineLatest, Subscription } from "rxjs";
import { map, filter, take } from "rxjs/operators";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { environment } from "../../../environments/environment";
import { StripeService } from "./stripe.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PaymentComponent } from "./payment/payment.component";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { OrganizationsService } from "src/app/api/organizations.service";

interface Percentages {
  total: number;
  errorEvents: number;
  transactionEvents: number;
  uptimeEvents: number;
  fileSize: number;
}

@Component({
  selector: "gt-subscription",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatDialogModule,
    RouterLink,
    MatFormFieldModule,
    MatButtonModule,
    PaymentComponent,
    MatProgressSpinnerModule,
    CurrencyPipe,
    DatePipe,
  ],
})
export class SubscriptionComponent implements OnDestroy {
  private service = inject(SubscriptionsService);
  private route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  private stripe = inject(StripeService);
  private orgService = inject(OrganizationsService);

  fromStripe = this.service.fromStripe;
  subscription = this.service.formattedSubscription;
  subscriptionLoading = this.service.subscriptionLoading;
  subscriptionLoadingTimeout = this.service.subscriptionLoadingTimeout;
  eventsCountWithTotal = this.service.eventsCountWithTotal;
  totalEventsAllowed = this.service.totalEventsAllowed;
  activeOrganization = this.orgService.activeOrganization;
  activeOrganizationSlug = this.orgService.activeOrganizationSlug;

  promptForProject = computed(() => {
    const status = this.orgService.activeOrganizationLoaded();
    const count = this.orgService.projectsCount();
    const subscription = this.service.subscription();
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
  });
  routerSubscription: Subscription;
  billingEmail = environment.billingEmail;
  error = this.stripe.error;
  eventsPercent = computed<Percentages>(() => {
    const eventsAllowed = this.totalEventsAllowed();
    const events = this.eventsCountWithTotal();
    return {
      total: (events?.total! / eventsAllowed!) * 100,
      errorEvents: (events?.eventCount! / eventsAllowed!) * 100,
      transactionEvents:
        (events?.transactionEventCount! / eventsAllowed!) * 100,
      uptimeEvents: (events?.uptimeCheckEventCount! / eventsAllowed!) * 100,
      fileSize: (events?.fileSizeMB! / eventsAllowed!) * 100,
    };
  });

  constructor() {
    this.routerSubscription = combineLatest([
      this.route.params,
      this.route.queryParams,
    ])
      .pipe(
        map(([params, queryParams]) => {
          const slug = params["org-slug"] as string;
          const sessionId = queryParams["session_id"];
          const redirectFromBillingPortal =
            queryParams["billing_portal_redirect"];
          return { slug, sessionId, redirectFromBillingPortal };
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
        if (routerData.redirectFromBillingPortal) {
          this.orgService.repeatRefreshOrgDetail();
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
    this.stripe.redirectToBillingPortal(this.activeOrganizationSlug());
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.service.clearState();
    this.stripe.clearState();
  }
}

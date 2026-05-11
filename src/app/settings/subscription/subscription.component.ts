import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  OnInit,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";
import { OrganizationsService } from "src/app/api/organizations.service";
import {
  SubscriptionService,
  SubscriptionState,
} from "src/app/api/subscriptions/subscription.service";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { UpgradeBannerComponent } from "src/app/shared/upgrade-banner/upgrade-banner.component";
import { environment } from "../../../environments/environment";
import { PaymentComponent } from "./payment/payment.component";
import { PaymentService } from "./payment/payment.service";
import { SubscriptionChartsComponent } from "./subscription-charts/subscription-charts.component";

@Component({
  selector: "gt-subscription",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TopAppBar,
    MatCardModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatDividerModule,
    MatIconModule,
    SubscriptionChartsComponent,
    UpgradeBannerComponent,
    PaymentComponent,
  ],
})
export class SubscriptionComponent
  extends StatefulComponent<SubscriptionState, SubscriptionService>
  implements OnInit
{
  private orgService = inject(OrganizationsService);
  private paymentService = inject(PaymentService);
  private dialog = inject(MatDialog);

  orgSlug = input.required<string>({ alias: "org-slug" });
  sessionId = input<string>("", { alias: "session_id" });
  billingPortalRedirect = input<string>("", {
    alias: "billing_portal_redirect",
  });

  readonly fromStripe = this.service.fromStripe;
  readonly subscription = this.service.subscription;
  readonly subscriptionLoading = this.service.subscriptionLoading;
  readonly subscriptionRefreshTimeout = this.service.subscriptionRefreshTimeout;
  readonly totalEventsAllowed = this.service.totalEventsAllowed;
  readonly activeOrganization = this.orgService.activeOrganization;
  readonly activeOrganizationSlug = this.orgService.activeOrganizationSlug;
  readonly billingPortalLoading = this.service.billingPortalLoading;
  readonly billingPortalLoadingError = this.service.billingPortalLoadingError;
  readonly upgradeLoading = computed(
    () => this.paymentService.subscriptionCreationLoadingId() !== null,
  );
  daysRemaining = computed(() => {
    const subscription = this.service.subscription();
    const endDate = subscription?.subscriptionCycleEnd ?? subscription?.currentPeriodEnd;
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, diff);
  });

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
  thisMonthPercent = this.service.thisMonthPercent;
  billingEmail = environment.billingEmail;

  nextProduct = computed(() => {
    const subscription = this.subscription();
    const products = this.paymentService.products();
    if (!subscription || !products.length) return null;

    const currentEvents = subscription.product.events ?? 0;
    const upgrades = products
      .filter((p) => p.events > currentEvents)
      .sort((a, b) => a.events - b.events);

    return upgrades[0] ?? null;
  });

  readonly topPlanEvents = computed(() => {
    const products = this.paymentService.products();
    if (!products.length) return null;
    return Math.max(...products.map((p) => p.events));
  });

  readonly freeEventLimit = computed(() => {
    const products = this.paymentService.products();
    const free = products.find((p) => p.defaultPrice?.price === 0);
    return free?.events ?? null;
  });

  constructor() {
    const service = inject(SubscriptionService);

    super(service);

    this.service = service;
  }

  ngOnInit(): void {
    this.orgService.activeOrganizationResource.reload();
    this.service.loadDetailData(this.orgSlug());
    this.paymentService.productsResource.reload();

    if (this.sessionId()) {
      this.service.refreshUntilSubscriptionOrTimeout();
    }
    if (this.billingPortalRedirect()) {
      this.orgService.repeatRefreshOrgDetail();
    }
  }

  manageSubscription() {
    this.service.redirectToBillingPortal();
  }

  upgradeToNextPlan() {
    const product = this.nextProduct();
    const org = this.orgService.activeOrganization();
    const subscription = this.subscription();
    if (!product || !org) return;
    const currentInterval = subscription?.price?.interval;
    const price =
      (product.defaultPrice.interval === currentInterval &&
        product.defaultPrice.isPublic &&
        product.defaultPrice) ||
      product.prices.find(
        (p) => p.interval === currentInterval && p.isPublic,
      );
    if (!price) return;
    this.paymentService.dispatchSubscriptionCreation(org, price);
  }

  openBuiltInPricing() {
    this.dialog.open(PaymentComponent, {
      width: "90vw",
      maxWidth: "1200px",
      maxHeight: "90vh",
    });
  }
}

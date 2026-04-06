import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  OnInit,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { environment } from "../../../environments/environment";
import {
  SubscriptionService,
  SubscriptionState,
} from "src/app/api/subscriptions/subscription.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PaymentComponent } from "./payment/payment.component";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { OrganizationsService } from "src/app/api/organizations.service";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
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
    MatFormFieldModule,
    MatButtonModule,
    PaymentComponent,
    MatProgressSpinnerModule,
    DatePipe,
    MatDividerModule,
    SubscriptionChartsComponent,
  ],
})
export class SubscriptionComponent
  extends StatefulComponent<SubscriptionState, SubscriptionService>
  implements OnInit
{
  private orgService = inject(OrganizationsService);

  orgSlug = input.required<string>({ alias: "org-slug" });
  sessionId = input<string>("", { alias: "session_id" });
  billingPortalRedirect = input<string>("", {
    alias: "billing_portal_redirect",
  });

  fromStripe = this.service.fromStripe;
  subscription = this.service.subscription;
  subscriptionLoading = this.service.subscriptionLoading;
  subscriptionRefreshTimeout = this.service.subscriptionRefreshTimeout;
  totalEventsAllowed = this.service.totalEventsAllowed;
  activeOrganization = this.orgService.activeOrganization;
  activeOrganizationSlug = this.orgService.activeOrganizationSlug;
  billingPortalLoading = this.service.billingPortalLoading;
  billingPortalLoadingError = this.service.billingPortalLoadingError;
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
  billingEmail = environment.billingEmail;

  constructor() {
    const service = inject(SubscriptionService);

    super(service);

    this.service = service;
  }

  ngOnInit(): void {
    this.orgService.activeOrganizationResource.reload();
    this.service.retrieveSubscriptionData(this.orgSlug());

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
}

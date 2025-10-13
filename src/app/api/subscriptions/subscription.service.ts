import { computed, Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client } from "../../shared/api/api";
import { SettingsService } from "../settings.service";
import { apiResource } from "src/app/shared/api/api-resource-factory";

export interface SubscriptionState {
  billingPortalLoading: boolean;
  billingPortalLoadingError: string;
  subscriptionRefreshing: boolean;
  subscriptionRefreshTimeout: boolean;
  fromStripe: boolean;
}

const initialState: SubscriptionState = {
  billingPortalLoading: false,
  billingPortalLoadingError: "",
  subscriptionRefreshing: false,
  subscriptionRefreshTimeout: false,
  fromStripe: false,
};

@Injectable({
  providedIn: "root",
})
export class SubscriptionService extends StatefulService<SubscriptionState> {
  private settingsService = inject(SettingsService);
  private router = inject(Router);

  stripePublicKey = this.settingsService.stripePublicKey;

  organizationSlug = signal<string>("");
  subscriptionResource = apiResource(this.organizationSlug, (orgSlug) => ({
    url: "/api/0/stripe/subscriptions/{organization_slug}/",
    options: {
      params: {
        path: { organization_slug: orgSlug },
      },
    },
  }));
  subscription = computed(() => {
    const subscriptionResponse = this.subscriptionResource.value();
    if (!subscriptionResponse) {
      return null;
    }
    const formattedSubscription = {
      ...subscriptionResponse,
      effectivePrice: +subscriptionResponse.price.price,
    };
    return formattedSubscription;
  });
  subscriptionLoading = computed(
    () =>
      this.subscriptionResource.isLoading() ||
      this.state().subscriptionRefreshing,
  );
  subscriptionRefreshTimeout = computed(
    () => this.state().subscriptionRefreshTimeout,
  );

  eventCountResource = apiResource(this.organizationSlug, (orgSlug) => ({
    url: "/api/0/stripe/subscriptions/{organization_slug}/events_count/",
    options: {
      params: {
        path: { organization_slug: orgSlug },
      },
    },
  }));
  eventsCountWithTotal = computed(() => {
    const eventsCount = this.eventCountResource.value();
    if (!eventsCount) return eventsCount;

    const total =
      eventsCount.eventCount! +
      eventsCount.transactionEventCount! +
      eventsCount.uptimeCheckEventCount! +
      eventsCount.fileSizeMb!;

    return { ...eventsCount, total };
  });

  billingPortalLoading = computed(() => this.state().billingPortalLoading);
  billingPortalLoadingError = computed(
    () => this.state().billingPortalLoadingError,
  );
  fromStripe = computed(() => this.state().fromStripe);
  totalEventsAllowed = computed(() => {
    const subscription = this.subscription();
    return subscription?.product.events || null;
  });
  refreshTimerRef: NodeJS.Timeout | undefined = undefined;

  constructor() {
    super(initialState);
  }

  retrieveSubscriptionData(orgSlug: string) {
    if (orgSlug) {
      this.organizationSlug.set(orgSlug);
    }
  }

  /**
   * Retrieve Subscription and navigate to subscription page if no subscription exists
   */
  async checkIfUserHasSubscription(orgSlug: string) {
    const subscriptionRoute = [orgSlug, "settings", "subscription"];
    if (
      !this.router.isActive(this.router.createUrlTree(subscriptionRoute), {
        paths: "exact",
        queryParams: "subset",
        fragment: "ignored",
        matrixParams: "ignored",
      })
    ) {
      const subscription = await this.getSubscriptionData(orgSlug);
      if (!subscription) {
        this.router.navigate(subscriptionRoute);
      }
    }
  }

  async redirectToBillingPortal() {
    this.setBillingPortalLoadingStart();
    const orgSlug = this.organizationSlug();
    const { data, error } = await client.POST(
      "/api/0/stripe/organizations/{organization_slug}/create-billing-portal/",
      {
        params: {
          path: { organization_slug: orgSlug },
        },
      },
    );
    if (error) {
      this.setBillingPortalLoadingError(
        "Something went wrong. Only organization owners can manage subscription settings.",
      );
    }
    if (data) {
      window.location.href = data.url;
    }
  }

  /**
   * Keep trying to get subscription, for users redirected from Stripe
   */
  refreshUntilSubscriptionOrTimeout() {
    this.setSubscriptionRefreshingStart();
    let i = 0;
    this.refreshTimerRef = setInterval(() => {
      this.subscriptionResource.reload();
      if (this.subscription()) {
        this.setSubscriptionRefreshingComplete();
        clearInterval(this.refreshTimerRef);
      } else if (i === 2) {
        this.setSubscriptionRefreshingTimeout();
        clearInterval(this.refreshTimerRef);
      }
      i++;
    }, 2000);
  }

  private async getSubscriptionData(orgSlug: string) {
    const { data, error } = await client.GET(
      "/api/0/stripe/subscriptions/{organization_slug}/",
      {
        params: {
          path: { organization_slug: orgSlug },
        },
      },
    );
    if (error) {
      throw error;
    }
    return data;
  }

  private setSubscriptionRefreshingStart() {
    this.setState({ subscriptionRefreshing: true, fromStripe: true });
  }

  private setSubscriptionRefreshingComplete() {
    this.setState({ subscriptionRefreshing: false });
  }

  private setSubscriptionRefreshingTimeout() {
    this.setState({
      subscriptionRefreshing: false,
      subscriptionRefreshTimeout: true,
    });
  }

  private setBillingPortalLoadingStart() {
    this.setState({ billingPortalLoading: true });
  }

  private setBillingPortalLoadingError(message: string) {
    this.setState({
      billingPortalLoading: false,
      billingPortalLoadingError: message,
    });
  }

  clearState() {
    super.clearState();
    this.organizationSlug.set("");
    this.subscriptionResource.set(undefined);
    this.eventCountResource.set(undefined);
    clearInterval(this.refreshTimerRef);
  }
}

import { computed, Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client } from "../../shared/api/api";
import { OrganizationsService } from "../organizations.service";
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
  private organizationsService = inject(OrganizationsService);
  private router = inject(Router);

  stripePublicKey = this.settingsService.stripePublicKey;

  // The explicitly-selected org (route / switcher), not the activeOrganizationSlug
  // fallback which defaults to organizations()[0]. These resources are read
  // app-wide (e.g. the Chatwoot effect in UserService), so keying on the fallback
  // briefly fetches the first org's data before the route resolves — the "loads
  // both orgs' subscriptions" / wrong-org fetch.
  private selectedSlug = computed(
    () => this.organizationsService.selectedOrganizationSlug() ?? "",
  );
  // Subscription fetch is billing-gated: no Stripe calls on self-hosted.
  organizationSlug = computed(() =>
    this.settingsService.billingEnabled() ? this.selectedSlug() : "",
  );
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

  // Gates the detail-page resources below; component owns the on/off lifecycle.
  // Keyed on selectedSlug, not the billing-gated organizationSlug, so the
  // self-hosted usage charts load too.
  private detailActive = signal(false);
  private detailSlug = computed(() =>
    this.detailActive() ? this.selectedSlug() : "",
  );

  setDetailActive(active: boolean) {
    this.detailActive.set(active);
  }

  eventsCountCurrentPeriodResource = apiResource(
    this.detailSlug,
    (orgSlug) => ({
      url: "/api/0/stripe/subscriptions/{organization_slug}/events_count/period/",
      options: {
        params: {
          path: { organization_slug: orgSlug },
          query: { periods_ago: 0 },
        },
      },
    }),
  );
  // We let events count resources fail silently,
  // since display components handle missing data
  eventsCountCurrentPeriod = computed(() => {
    if (this.eventsCountCurrentPeriodResource.error()) return null;
    return this.eventsCountCurrentPeriodResource.value();
  });
  currentPeriodLoading = this.eventsCountCurrentPeriodResource.isLoading;

  eventsCountPreviousPeriodResource = apiResource(
    this.detailSlug,
    (orgSlug) => ({
      url: "/api/0/stripe/subscriptions/{organization_slug}/events_count/period/",
      options: {
        params: {
          path: { organization_slug: orgSlug },
          query: { periods_ago: 1 },
        },
      },
    }),
  );
  eventsCountPreviousPeriod = computed(() => {
    if (this.eventsCountPreviousPeriodResource.error()) return null;
    return this.eventsCountPreviousPeriodResource.value();
  });
  previousPeriodLoading = this.eventsCountPreviousPeriodResource.isLoading;

  dailyEventsResource = apiResource(this.detailSlug, (orgSlug) => ({
    url: "/api/0/stripe/subscriptions/{organization_slug}/events_count/daily/",
    options: {
      params: {
        path: { organization_slug: orgSlug },
      },
    },
  }));
  dailyEvents = computed(() => {
    if (this.dailyEventsResource.error()) return [];
    return this.dailyEventsResource.value()?.data ?? [];
  });

  predictedEndOfMonth = computed(() => {
    const subscription = this.subscription();
    const eventsCountCurrentPeriod = this.eventsCountCurrentPeriod();
    if (
      !subscription?.subscriptionCycleStart ||
      !subscription?.subscriptionCycleEnd ||
      !eventsCountCurrentPeriod
    )
      return null;

    const cycleStart = new Date(subscription.subscriptionCycleStart);
    const cycleEnd = new Date(subscription.subscriptionCycleEnd);
    const now = new Date();

    const totalDays =
      (cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24);
    const elapsedDays =
      (now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24);

    if (totalDays <= 0 || elapsedDays < 1) return null;

    return Math.round(
      ((eventsCountCurrentPeriod.total ?? 0) / elapsedDays) * totalDays,
    );
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

  thisMonthPercent = computed(() => {
    const total = this.totalEventsAllowed();
    const current = this.eventsCountCurrentPeriod();
    if (!total || !current?.total) return 0;
    return Math.round((current.total / total) * 100);
  });

  refreshTimerRef: number | undefined = undefined;

  constructor() {
    super(initialState);
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
      this.setState({ billingPortalLoading: false });
      window.location.href = data.url;
    }
  }

  /**
   * Keep trying to get subscription, for users redirected from Stripe
   */
  refreshUntilSubscriptionOrTimeout() {
    // Re-entry guard: only one polling timer should run at a time.
    if (this.refreshTimerRef !== undefined) return;
    this.setSubscriptionRefreshingStart();
    let i = 0;
    this.refreshTimerRef = window.setInterval(() => {
      this.subscriptionResource.reload();
      if (this.subscription()) {
        this.setSubscriptionRefreshingComplete();
        clearInterval(this.refreshTimerRef);
        this.refreshTimerRef = undefined;
      } else if (i === 2) {
        this.setSubscriptionRefreshingTimeout();
        clearInterval(this.refreshTimerRef);
        this.refreshTimerRef = undefined;
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
    this.detailActive.set(false);
    // Intentionally NOT clearing subscriptionResource here: it is keyed on the
    // selected org slug, which is unchanged on client-side re-entry within the
    // same org, so once cleared it would not refetch and the page would render
    // the empty "no subscription" view until a full page reload. It updates
    // reactively on org change and is reloaded by the flows that mutate it
    // (free-tier creation, post-Stripe return). The per-page usage resources
    // below are safe to clear; they refetch reactively once setDetailActive(true)
    // re-flips detailSlug back to the current org on re-entry.
    this.eventsCountCurrentPeriodResource.set(undefined);
    this.dailyEventsResource.set(undefined);
    this.eventsCountPreviousPeriodResource.set(undefined);
    clearInterval(this.refreshTimerRef);
    this.refreshTimerRef = undefined;
  }
}

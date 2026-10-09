import { computed, Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client, handleError } from "../../shared/api/api";
import { UNHANDLED_ERROR } from "src/app/constants";
import { OrganizationsService } from "../organizations.service";
import { SettingsService } from "../settings.service";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import {
  capAdjustable,
  capBelowBilled as overageCapBelowBilled,
  capReached as overageCapReached,
  displayedThrottleRate,
  isOverageInactive,
  overageInactiveCause,
  overageThrottleState,
  reportedCostOwedCents as overageReportedCostOwedCents,
} from "./overage-throttle-state";
import { showSubscriptionRefreshTimeout } from "./subscription-refresh-state";

export interface SubscriptionState {
  billingPortalLoading: boolean;
  billingPortalLoadingError: string;
  subscriptionRefreshing: boolean;
  // Org slug, not a flag: switching org keeps the page mounted.
  subscriptionRefreshTimeoutSlug: string | null;
  fromStripe: boolean;
  overageConfigLoading: boolean;
  overageConfigError: string;
}

const initialState: SubscriptionState = {
  billingPortalLoading: false,
  billingPortalLoadingError: "",
  subscriptionRefreshing: false,
  subscriptionRefreshTimeoutSlug: null,
  fromStripe: false,
  overageConfigLoading: false,
  overageConfigError: "",
};

// How long after a cap change to refetch overage status a second time. The
// server clears the throttle rate in an enqueued task, so this only needs to
// outlast typical task-queue latency, not a sweep interval.
const THROTTLE_SETTLE_REFETCH_MS = 5_000;

@Injectable({
  providedIn: "root",
})
export class SubscriptionService extends StatefulService<SubscriptionState> {
  private settingsService = inject(SettingsService);
  private organizationsService = inject(OrganizationsService);
  private router = inject(Router);
  private throttleSettleTimer: ReturnType<typeof setTimeout> | undefined;

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
    url: "/api/0/stripe/subscriptions/{organization_id_or_slug}/",
    options: {
      params: {
        path: {
          organization_id_or_slug:
            this.organizationsService.orgIdOrSlug(orgSlug),
        },
      },
    },
  }));
  subscription = computed(() => {
    // value() throws in the error state.
    if (!this.subscriptionResource.hasValue()) {
      return null;
    }
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
  subscriptionRefreshTimeout = computed(() =>
    showSubscriptionRefreshTimeout(
      this.state().subscriptionRefreshTimeoutSlug,
      this.organizationSlug(),
      this.subscription() != null,
    ),
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
    // Keyed on the org, not detailSlug, so entry does not re-trigger the fetch.
    // Reload explicitly, or the card renders whatever the snackbar last cached.
    if (active) {
      this.overageStatusResource.reload();
    }
  }

  eventsCountCurrentPeriodResource = apiResource(
    this.detailSlug,
    (orgSlug) => ({
      url: "/api/0/stripe/subscriptions/{organization_id_or_slug}/events_count/period/",
      options: {
        params: {
          path: {
            organization_id_or_slug:
              this.organizationsService.orgIdOrSlug(orgSlug),
          },
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
      url: "/api/0/stripe/subscriptions/{organization_id_or_slug}/events_count/period/",
      options: {
        params: {
          path: {
            organization_id_or_slug:
              this.organizationsService.orgIdOrSlug(orgSlug),
          },
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
    url: "/api/0/stripe/subscriptions/{organization_id_or_slug}/events_count/daily/",
    options: {
      params: {
        path: {
          organization_id_or_slug:
            this.organizationsService.orgIdOrSlug(orgSlug),
        },
      },
    },
  }));
  dailyEvents = computed(() => {
    if (this.dailyEventsResource.error()) return [];
    return this.dailyEventsResource.value()?.data ?? [];
  });

  // The snackbar shows app-wide, so this is keyed on the org rather than
  // detailSlug: one call per billing-enabled org, and the key stays a signal.
  overageStatusResource = apiResource(this.organizationSlug, (orgSlug) => ({
    url: "/api/0/stripe/subscriptions/{organization_id_or_slug}/overage/",
    options: {
      params: {
        path: {
          organization_id_or_slug:
            this.organizationsService.orgIdOrSlug(orgSlug),
        },
      },
    },
  }));
  overageStatus = computed(() => {
    if (this.overageStatusResource.error()) return null;
    return this.overageStatusResource.value() ?? null;
  });
  // Narrower than an "unknown" throttle state, which also covers the initial
  // load. Surfaces only the failed fetch, where the organization payload can
  // still report a throttle rate we would otherwise say nothing about.
  overageStatusUnavailable = computed(
    () => !!this.overageStatusResource.error(),
  );

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

  overageEnabled = computed(() => this.overageStatus()?.enabled ?? false);
  overageEligible = computed(() => this.overageStatus()?.eligible ?? false);
  overageConfigured = computed(() => this.overageStatus()?.configured ?? false);
  // Server-enforced ceiling; env-configurable, so the client reads it rather
  // than keeping a copy. Falls back to the server default before status loads.
  maxCapCents = computed(() => this.overageStatus()?.maxCapCents ?? 1_000_000);
  // One definition, shared with overageThrottleState: whether the configure
  // endpoint would accept a cap change. Gates the render, the Adjust button and
  // the "raise the cap" remedy alike, so the three cannot disagree.
  canConfigureOverage = computed(() => capAdjustable(this.overageStatus()));

  // Percent of new events being dropped (0 = none, 100 = all).
  throttleRate = computed(() => this.overageStatus()?.throttleRate ?? 0);
  overageInactive = computed(() => isOverageInactive(this.overageStatus()));
  inactiveCause = computed(() => overageInactiveCause(this.overageStatus()));
  throttleState = computed(() => overageThrottleState(this.overageStatus()));
  // The page banner's rate, from the same response as throttleState.
  eventThrottleRate = computed(() =>
    displayedThrottleRate(
      this.overageStatus(),
      this.organizationsService.activeOrganization()?.eventThrottleRate,
    ),
  );
  // The banner's copy depends on this, so a throttled org's page waits for it.
  // Reloads keep the previous value, so the post-save refetch won't trip it.
  throttleStatePending = computed(
    () =>
      !!this.organizationsService.activeOrganization()?.eventThrottleRate &&
      this.throttleState() === "unknown" &&
      !this.overageStatusUnavailable(),
  );

  // Progress by units, not cost (floored capUnits keep cost just under the cap).
  capProgressPercent = computed(() => {
    const s = this.overageStatus();
    if (!s || !s.capUnits) return 0;
    return Math.min(100, Math.round((s.overageUnits / s.capUnits) * 100));
  });

  capReached = computed(() => overageCapReached(this.overageStatus()));
  capBelowBilled = computed(() => overageCapBelowBilled(this.overageStatus()));
  reportedCostOwedCents = computed(() =>
    overageReportedCostOwedCents(this.overageStatus()),
  );

  // Forecast cap hit this cycle, in units (clients have no tier rates for $).
  private predictedOverageUnits = computed(() => {
    const predicted = this.predictedEndOfMonth();
    const s = this.overageStatus();
    if (predicted == null || !s) return null;
    return Math.max(0, predicted - s.quota);
  });
  willReachCap = computed(() => {
    const s = this.overageStatus();
    const predUnits = this.predictedOverageUnits();
    if (!s || !s.enabled || !s.capUnits || predUnits == null) return false;
    return predUnits >= s.capUnits;
  });

  overageConfigLoading = computed(() => this.state().overageConfigLoading);
  overageConfigError = computed(() => this.state().overageConfigError);

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
      "/api/0/stripe/organizations/{organization_id_or_slug}/create-billing-portal/",
      {
        params: {
          path: {
            organization_id_or_slug:
              this.organizationsService.orgIdOrSlug(orgSlug),
          },
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
   * Enable/disable metered overage billing and set the spend cap (owner-only).
   * Enabling migrates the Stripe subscription from classic to flexible (one-way)
   * and attaches a metered item; the caller confirms that with the user first.
   */
  async configureOverage(enabled: boolean, capCents: number) {
    this.setState({ overageConfigLoading: true, overageConfigError: "" });
    const orgSlug = this.organizationSlug();
    // openapi-fetch rethrows a rejected fetch, so without the finally an
    // offline request would leave the spinner running and the toggle disabled
    // with no way back.
    try {
      const { data, error, response } = await client.POST(
        "/api/0/stripe/organizations/{organization_id_or_slug}/overage/",
        {
          params: {
            path: {
              organization_id_or_slug:
                this.organizationsService.orgIdOrSlug(orgSlug),
            },
          },
          body: { enabled, capCents },
        },
      );
      if (response.status === 404) {
        this.setState({
          overageConfigError:
            "Only organization owners can change billing settings.",
        });
        return null;
      }
      if (error || !data) {
        this.setState({
          overageConfigError: handleError(error, response).detail[0].msg,
        });
        return null;
      }
      // Refetch rather than writing the response body in. The server recomputes
      // the throttle rate in a task it enqueues on the way out, so the body it
      // returns pairs the new cap with the pre-change rate; storing that leaves
      // the card claiming events are being dropped after they have resumed.
      // `set` would also park the resource, so nothing would correct it later.
      this.overageStatusResource.reload();
      this.subscriptionResource.reload();
      // The immediate reload above races that task and usually loses, showing
      // the "taking effect" notice. One delayed refetch picks up the cleared
      // rate so the notice dismisses itself; no polling, the state cannot
      // outlive the task. Replaces, not stacks, on rapid saves.
      clearTimeout(this.throttleSettleTimer);
      this.throttleSettleTimer = setTimeout(
        () => this.overageStatusResource.reload(),
        THROTTLE_SETTLE_REFETCH_MS,
      );
      return data;
    } catch {
      this.setState({ overageConfigError: UNHANDLED_ERROR });
      return null;
    } finally {
      this.setState({ overageConfigLoading: false });
    }
  }

  /**
   * Keep trying to get subscription, for users redirected from Stripe
   */
  refreshUntilSubscriptionOrTimeout() {
    // Re-entry guard: only one polling timer should run at a time.
    if (this.refreshTimerRef !== undefined) return;
    const orgSlug = this.organizationSlug();
    this.setSubscriptionRefreshingStart();
    let i = 0;
    this.refreshTimerRef = window.setInterval(() => {
      this.subscriptionResource.reload();
      if (this.subscription()) {
        this.setSubscriptionRefreshingComplete();
        clearInterval(this.refreshTimerRef);
        this.refreshTimerRef = undefined;
      } else if (i === 2) {
        this.setSubscriptionRefreshingTimeout(orgSlug);
        clearInterval(this.refreshTimerRef);
        this.refreshTimerRef = undefined;
      }
      i++;
    }, 2000);
  }

  private async getSubscriptionData(orgSlug: string) {
    const { data, error } = await client.GET(
      "/api/0/stripe/subscriptions/{organization_id_or_slug}/",
      {
        params: {
          path: {
            organization_id_or_slug:
              this.organizationsService.orgIdOrSlug(orgSlug),
          },
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

  private setSubscriptionRefreshingTimeout(orgSlug: string) {
    this.setState({
      subscriptionRefreshing: false,
      subscriptionRefreshTimeoutSlug: orgSlug,
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
    // overageStatusResource is excluded for the same reason: it is keyed on the
    // org slug too. setDetailActive(true) reloads it explicitly on re-entry.
    this.eventsCountCurrentPeriodResource.set(undefined);
    this.dailyEventsResource.set(undefined);
    this.eventsCountPreviousPeriodResource.set(undefined);
    clearInterval(this.refreshTimerRef);
    this.refreshTimerRef = undefined;
  }
}

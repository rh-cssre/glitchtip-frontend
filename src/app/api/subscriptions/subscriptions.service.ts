import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { EMPTY, lastValueFrom, timer } from "rxjs";
import { catchError, delay, expand, map, tap, takeUntil } from "rxjs/operators";
import {
  Subscription,
  Plan,
  Product,
  CreateSubscriptionResp,
  EventsCount,
} from "./subscriptions.interfaces";
import { baseUrl } from "src/app/constants";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { Organization } from "../organizations/organizations.interface";

import { StripeService } from "src/app/settings/subscription/stripe.service";

interface SubscriptionsState {
  subscriptionCreationLoadingId: string | null;
  subscription: Subscription | null;
  subscriptionLoading: boolean;
  subscriptionLoadingTimeout: boolean;
  fromStripe: boolean;
  eventsCount: EventsCount | null;
  products: Product[] | null;
}

const initialState: SubscriptionsState = {
  subscriptionCreationLoadingId: null,
  subscription: null,
  subscriptionLoading: false,
  subscriptionLoadingTimeout: false,
  fromStripe: false,
  eventsCount: null,
  products: null,
};

@Injectable({
  providedIn: "root",
})
export class SubscriptionsService extends StatefulService<SubscriptionsState> {
  private readonly url = baseUrl + "/subscriptions/";

  readonly subscription$ = this.getState$.pipe(
    map((state) => state.subscription)
  );
  readonly subscriptionLoading$ = this.getState$.pipe(
    map((state) => state.subscriptionLoading)
  );
  readonly subscriptionLoadingTimeout$ = this.getState$.pipe(
    map((state) => state.subscriptionLoadingTimeout)
  );
  readonly subscriptionCreationLoadingId$ = this.getState$.pipe(
    map((state) => state.subscriptionCreationLoadingId)
  );
  readonly fromStripe$ = this.getState$.pipe(map((state) => state.fromStripe));
  readonly eventsCountWithTotal$ = this.getState$.pipe(
    map((state) => {
      let total = 0;
      if (state.eventsCount) {
        total +=
          state.eventsCount.eventCount! +
          state.eventsCount.transactionEventCount! +
          state.eventsCount.uptimeCheckEventCount! +
          state.eventsCount.fileSizeMB!;

        return {
          ...state.eventsCount,
          total,
        };
      } else {
        return state.eventsCount;
      }
    })
  );

  readonly planOptions$ = this.getState$.pipe(map((state) => state.products));
  readonly planOptionsWithShortNames$ = this.planOptions$.pipe(
    map((plans) => {
      return plans?.map((plan) => ({
        ...plan,
        name: plan.name.startsWith("GlitchTip ")
          ? plan.name.substring(10)
          : plan.name,
      }));
    })
  );

  constructor(
    private http: HttpClient,
    private stripe: StripeService,
    private router: Router
  ) {
    super(initialState);
  }

  /**
   * Retrieve subscription for this organization
   * @param slug Organization Slug for requested subscription
   */
  retrieveSubscription(slug: string) {
    this.setSubscriptionLoadingStart();
    lastValueFrom(
      this.getSubscription(slug).pipe(
        tap((subscription) => {
          this.setSubscription(subscription);
        }),
        catchError(() => {
          this.setSubscriptionLoadingEnd();
          return EMPTY;
        })
      ),
      { defaultValue: null }
    );
  }

  /**
   * Keep trying to get subscription, for users redirected from Stripe
   * @param slug Organization Slug for requested subscription
   */
  retrieveUntilSubscriptionOrTimeout(slug: string) {
    this.setSubscriptionLoadingStart(true);
    lastValueFrom(
      this.getSubscription(slug).pipe(
        expand((subscription) => {
          if (!subscription.created) {
            return this.getSubscription(slug).pipe(delay(2000));
          } else {
            this.setSubscription(subscription);
            return EMPTY;
          }
        }),
        catchError(() => {
          this.setSubscriptionLoadingEnd();
          return EMPTY;
        }),
        takeUntil(this.subscriptionRetryTimer())
      ),
      { defaultValue: null }
    );
  }

  /**
   * Retrieve event count for current active subscription for this organization
   * @param slug Organization Slug for requested subscription event count
   */
  retrieveSubscriptionEventCount(slug: string) {
    lastValueFrom(
      this.getSubscriptionEventCount(slug).pipe(
        tap((count) => this.setSubscriptionCount(count)),
        catchError((error) => {
          return EMPTY;
        })
      ),
      { defaultValue: null }
    );
  }

  /**
   * Retrieve subscription plans
   * productAmountSorted converts product prices to ints and sorts from low to high
   */
  retrieveSubscriptionPlans() {
    lastValueFrom(
      this.getSubscriptionPlans().pipe(
        tap((products) => {
          const productAmountSorted = products
            .map((product) => ({
              ...product,
              plans: product.plans.map((plans) => ({
                ...plans,
                amount: +plans.amount,
              })),
            }))
            .sort((a, b) => a.plans[0].amount - b.plans[0].amount);
          this.setProducts(productAmountSorted);
        })
      )
    );
  }

  dispatchSubscriptionCreation(organization: Organization, plan: Plan) {
    this.setSubscriptionCreationStart(plan.id);
    if (plan.amount === 0) {
      lastValueFrom(
        this.createSubscription(organization, plan.id).pipe(
          tap((resp) => {
            this.setSubscription(resp.subscription);
            this.router.navigate([organization.slug, "issues"]);
          })
        )
      );
    } else {
      this.stripe.redirectToSubscriptionCheckout(organization.id, plan.id);
    }
  }

  /**
   * Retrieve Subscription and navigate to subscription page if no subscription exists
   */
  checkIfUserHasSubscription(orgSlug: string) {
    const subscriptionRoute = [orgSlug, "settings", "subscription"];
    if (
      !this.router.isActive(this.router.createUrlTree(subscriptionRoute), {
        paths: "exact",
        queryParams: "subset",
        fragment: "ignored",
        matrixParams: "ignored",
      })
    ) {
      lastValueFrom(
        this.getSubscription(orgSlug).pipe(
          tap((subscription) => {
            if (subscription.status === null) {
              this.router.navigate(subscriptionRoute);
            }
          })
        )
      );
    }
  }

  private createSubscription(organization: Organization, planId: string) {
    const data = {
      organization: organization.id,
      plan: planId,
    };
    return this.http.post<CreateSubscriptionResp>(
      "/api/0/subscriptions/",
      data
    );
  }

  private getSubscription(slug: string) {
    return this.http.get<Subscription>(`${this.url}${slug}/`);
  }

  private getSubscriptionEventCount(slug: string) {
    return this.http.get<EventsCount>(`${this.url}${slug}/events_count/`);
  }

  private getSubscriptionPlans() {
    return this.http.get<Product[]>("/api/0/products/");
  }

  private subscriptionRetryTimer() {
    return timer(60000).pipe(
      tap(() => {
        this.setSubscriptionLoadingTimeout();
      })
    );
  }

  private setProducts(products: Product[]) {
    this.setState({ products });
  }

  private setSubscription(subscription: Subscription) {
    this.setState({
      subscription,
      subscriptionLoading: false,
      subscriptionCreationLoadingId: null,
    });
  }

  private setSubscriptionLoadingStart(fromStripe: boolean = false) {
    this.setState({ subscriptionLoading: true, fromStripe });
  }

  private setSubscriptionLoadingEnd() {
    this.setState({ subscriptionLoading: false });
  }

  private setSubscriptionLoadingTimeout() {
    this.setState({
      subscriptionLoading: false,
      subscriptionLoadingTimeout: true,
    });
  }

  private setSubscriptionCreationStart(subscriptionCreationLoadingId: string) {
    this.setState({ subscriptionCreationLoadingId });
  }

  private setSubscriptionCount(eventsCount: EventsCount) {
    this.setState({ eventsCount });
  }
}

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, lastValueFrom, timer } from "rxjs";
import { catchError, delay, expand, map, tap, takeUntil } from "rxjs/operators";
import {
  Subscription,
  Plan,
  Product,
  EventsCount,
} from "./subscriptions.interfaces";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { Organization } from "../organizations/organizations.interface";
import { ProductsAPIService } from "./products-api.service";
import { StripeService } from "src/app/settings/subscription/stripe.service";
import { SubscriptionsAPIService } from "./subscriptions-api.service";

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
    private productsAPIService: ProductsAPIService,
    private subscriptionsAPIService: SubscriptionsAPIService,
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
      this.subscriptionsAPIService.retrieve(slug).pipe(
        tap((subscription) => {
          this.setSubscription(subscription);
        }),
        catchError(() => {
          this.setSubscriptionLoadingError();
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
      this.subscriptionsAPIService.retrieve(slug).pipe(
        expand((subscription) => {
          if (!subscription.created) {
            return this.subscriptionsAPIService
              .retrieve(slug)
              .pipe(delay(2000));
          } else {
            this.setSubscription(subscription);
            return EMPTY;
          }
        }),
        catchError(() => {
          this.setSubscriptionLoadingError();
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
      this.subscriptionsAPIService.retrieveEventsCount(slug).pipe(
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
      this.productsAPIService.list().pipe(
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
        this.subscriptionsAPIService.create(organization.id, plan.id).pipe(
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
        this.subscriptionsAPIService.retrieve(orgSlug).pipe(
          tap((subscription) => {
            if (subscription.status === null) {
              this.router.navigate(subscriptionRoute);
            }
          })
        )
      );
    }
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

  private setSubscriptionLoadingError() {
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

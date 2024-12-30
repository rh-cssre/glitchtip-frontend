import { computed, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, lastValueFrom, timer } from "rxjs";
import { catchError, delay, expand, tap, takeUntil } from "rxjs/operators";
import { Subscription, Product, EventsCount } from "./subscriptions.interfaces";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { ProductsAPIService } from "./products-api.service";
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
  subscription = computed(() => this.state().subscription);
  formattedSubscription = computed(() => {
    const subscription = this.subscription();
    if (!subscription?.items[0]?.price) return null;

    const { unit_amount } = subscription.items[0].price;
    const { name, description } = subscription.items[0].price.product;

    return {
      ...subscription,
      mainUnitPrice: unit_amount / 100,
      productName: name,
      productDescription: description,
    };
  });
  subscriptionLoading = computed(() => this.state().subscriptionLoading);
  subscriptionLoadingTimeout = computed(
    () => this.state().subscriptionLoadingTimeout
  );
  subscriptionCreationLoadingId = computed(
    () => this.state().subscriptionCreationLoadingId
  );
  fromStripe = computed(() => this.state().fromStripe);
  eventsCountWithTotal = computed(() => {
    const state = this.state();
    if (!state.eventsCount) return state.eventsCount;

    const total =
      state.eventsCount.eventCount! +
      state.eventsCount.transactionEventCount! +
      state.eventsCount.uptimeCheckEventCount! +
      state.eventsCount.fileSizeMB!;

    return { ...state.eventsCount, total };
  });
  totalEventsAllowed = computed(() => {
    const subscription = this.subscription();
    return subscription?.items[0]?.price?.product?.metadata?.events
      ? parseInt(subscription.items[0].price.product.metadata.events, 10)
      : null;
  });
  productOptions = computed(() => this.state().products);
  formattedProductOptions = computed(() =>
    this.productOptions()?.map((product) => ({
      ...product,
      name: product.name.startsWith("GlitchTip ")
        ? product.name.slice(10)
        : product.name,
      mainUnitPrice: product.prices[0].unit_amount / 100,
    }))
  );

  constructor(
    private productsAPIService: ProductsAPIService,
    private subscriptionsAPIService: SubscriptionsAPIService,
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
  retrieveProducts() {
    lastValueFrom(
      this.productsAPIService.list().pipe(
        tap((products) => {
          const productAmountSorted = products.sort(
            (a, b) => a.prices[0].unit_amount - b.prices[0].unit_amount
          );
          this.setProducts(productAmountSorted);
        })
      )
    );
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
            if (subscription === null) {
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

  setSubscription(subscription: Subscription) {
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

  private setSubscriptionCount(eventsCount: EventsCount) {
    this.setState({ eventsCount });
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, EMPTY } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
import {
  Subscription,
  Product,
  CreateSubscriptionResp,
  EventsCount,
} from "./subscriptions.interfaces";
import { baseUrl } from "src/app/constants";

interface SubscriptionsState {
  subscription: Subscription | null;
  eventsCount: EventsCount | null;
  products: Product[] | null;
}

const initialState: SubscriptionsState = {
  subscription: null,
  eventsCount: null,
  products: null,
};

@Injectable({
  providedIn: "root",
})
export class SubscriptionsService {
  private readonly state = new BehaviorSubject<SubscriptionsState>(
    initialState
  );
  private readonly getState$ = this.state.asObservable();
  private readonly url = baseUrl + "/subscriptions/";

  readonly subscription$ = this.getState$.pipe(
    map((state) => state.subscription)
  );
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

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Retrieve subscription for this organization
   * @param slug Organization Slug for requested subscription
   */
  retrieveSubscription(slug: string) {
    return this.http.get<Subscription>(`${this.url}${slug}/`).pipe(
      tap((subscription) => this.setSubscription(subscription)),
      catchError((error) => {
        this.clearState();
        return EMPTY;
      })
    );
  }

  /**
   * Retrieve event count for current active subscription for this organization
   * @param slug Organization Slug for requested subscription event count
   */
  retrieveSubscriptionCount(slug: string) {
    return this.http.get<EventsCount>(`${this.url}${slug}/events_count/`).pipe(
      tap((count) => this.setSubscriptionCount(count)),
      catchError((error) => {
        return EMPTY;
      })
    );
  }

  /**
   * Retrieve subscription plans
   * productAmountSorted converts product prices to ints and sorts from low to high
   */
  retrieveSubscriptionPlans() {
    return this.http.get<Product[]>("/api/0/products/").pipe(
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
    );
  }

  createFreeSubscription(organizationId: number, planId: string) {
    const data = {
      organization: organizationId,
      plan: planId,
    };
    return this.http
      .post<CreateSubscriptionResp>("/api/0/subscriptions/", data)
      .pipe(
        tap((resp) => {
          this.setSubscription(resp.subscription);
        })
      );
  }

  /**
   * Retrieve Subscription and navigate to subscription page if no subscription exists
   */
  checkIfUserHasSubscription(orgSlug: string) {
    this.retrieveSubscription(orgSlug)
      .pipe(
        tap((subscription) => {
          if (subscription.status === null) {
            this.router.navigate([orgSlug, "settings", "subscription"]);
          }
        })
      )
      .toPromise();
  }

  clearState() {
    this.state.next(initialState);
  }

  private setProducts(products: Product[]) {
    this.state.next({ ...this.state.getValue(), products });
  }

  private setSubscription(subscription: Subscription) {
    this.state.next({ ...this.state.getValue(), subscription });
  }

  private setSubscriptionCount(eventsCount: EventsCount) {
    this.state.next({ ...this.state.getValue(), eventsCount });
  }
}

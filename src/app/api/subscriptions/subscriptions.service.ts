import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, EMPTY } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
import {
  Subscription,
  Plan,
  CreateSubscriptionResp,
} from "./subscriptions.interfaces";
import { baseUrl } from "src/app/constants";

interface SubscriptionsState {
  subscription: Subscription | null;
  plans: Plan[] | null;
}

const initialState: SubscriptionsState = {
  subscription: null,
  plans: null,
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
  readonly planOptions$ = this.getState$.pipe(map((state) => state.plans));

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

  retrieveSubscriptionPlans() {
    return this.http
      .get<Plan[]>("/api/0/plans/")
      .pipe(tap((plans) => this.setPlans(plans)));
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
            this.router.navigate(["settings", orgSlug, "subscription"]);
          }
        })
      )
      .toPromise();
  }

  clearState() {
    this.state.next(initialState);
  }

  private setPlans(plans: Plan[]) {
    this.state.next({ ...this.state.getValue(), plans });
  }

  private setSubscription(subscription: Subscription) {
    this.state.next({ ...this.state.getValue(), subscription });
  }
}

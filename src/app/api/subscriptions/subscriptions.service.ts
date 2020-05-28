import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, EMPTY } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
import { Subscription } from "./subscriptions.interfaces";
import { baseUrl } from "src/app/constants";

interface SubscriptionsState {
  subscription: Subscription | null;
}

const initialState: SubscriptionsState = {
  subscription: null,
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

  constructor(private http: HttpClient) {}

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

  retrievePlans() {
    return this.http
      .get("http://localhost:8000/api/0/plans/")
      .pipe(tap((plans) => console.log("plans: ", plans)));
  }

  clearState() {
    this.state.next(initialState);
  }

  private setSubscription(subscription: Subscription) {
    this.state.next({ ...this.state.getValue(), subscription });
  }
}

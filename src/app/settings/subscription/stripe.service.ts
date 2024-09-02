import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { tap, exhaustMap, withLatestFrom, map } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import {
  StripeCheckoutSession,
  StripeBillingPortalSession,
} from "./stripe.interfaces";
import { loadStripe } from "@stripe/stripe-js";
import { EMPTY, catchError } from "rxjs";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { SettingsService } from "src/app/api/settings.service";

export interface StripeState {
  error: string | null;
}

const initialState: StripeState = {
  error: null,
};

@Injectable({
  providedIn: "root",
})
export class StripeService extends StatefulService<StripeState> {
  stripePublicKey$ = this.settingsService.stripePublicKey$;

  readonly error$ = this.getState$.pipe(map((state) => state.error));
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
  ) {
    super(initialState);
  }

  redirectToSubscriptionCheckout(organizationSlug: string, price: string) {
    lastValueFrom(
      this.createSubscriptionCheckout(organizationSlug, price).pipe(
        withLatestFrom(this.settingsService.stripePublicKey$),
        exhaustMap(([resp, stripePublicKey]) => {
          if (stripePublicKey) {
            return loadStripe(stripePublicKey).then((stripe) =>
              stripe?.redirectToCheckout({ sessionId: resp.id }),
            );
          } else {
            return EMPTY;
          }
        }),
      ),
      { defaultValue: null },
    );
  }

  /**
   * Redirect the user to Stripe's self service billing portal
   * https://stripe.com/docs/billing/subscriptions/integrating-self-serve-portal
   */
  redirectToBillingPortal(organizationSlug: string) {
    lastValueFrom(
      this.createBillingPortal(organizationSlug).pipe(
        tap((resp) => (window.location.href = resp.url)),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 400) {
              this.setState({
                error:
                  "Only organization owners can manage subscription settings.",
              });
            } else {
              this.setState({ error: err.statusText });
            }
          } else {
            this.setState({ error: "Unknown Error" });
          }
          return EMPTY;
        }),
      ),
      { defaultValue: null },
    );
  }

  clearState() {
    this.state.next(initialState);
  }

  private createSubscriptionCheckout(organizationSlug: string, price: string) {
    const url = `${baseUrl}/organizations/${organizationSlug}/create-stripe-subscription-checkout/`;
    const data = {
      price,
    };
    return this.http.post<StripeCheckoutSession>(url, data);
  }

  private createBillingPortal(organizationSlug: string) {
    const url =
      baseUrl + `/organizations/${organizationSlug}/create-billing-portal/`;
    return this.http.post<StripeBillingPortalSession>(url, {});
  }
}

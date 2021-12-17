import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { tap, exhaustMap, withLatestFrom, map } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import {
  StripeCheckoutSession,
  StripeBillingPortalSession,
} from "./stripe.interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { loadStripe } from "@stripe/stripe-js";
import { SettingsService } from "src/app/api/settings.service";
import { EMPTY, catchError } from "rxjs";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";

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
  activeOrganizationId$ = this.organizationService.activeOrganizationId$;
  stripePublicKey$ = this.settingsService.stripePublicKey$;

  readonly error$ = this.getState$.pipe(map((state) => state.error));
  constructor(
    private http: HttpClient,
    private organizationService: OrganizationsService,
    private settingsService: SettingsService
  ) {
    super(initialState);
  }

  redirectToSubscriptionCheckout(plan: string) {
    return this.activeOrganizationId$
      .pipe(
        exhaustMap((organization) => {
          if (organization) {
            return this.createSubscriptionCheckout(organization, plan).pipe(
              withLatestFrom(this.settingsService.stripePublicKey$),
              exhaustMap(([resp, stripePublicKey]) => {
                if (stripePublicKey) {
                  return loadStripe(stripePublicKey).then((stripe) =>
                    stripe?.redirectToCheckout({ sessionId: resp.id })
                  );
                } else {
                  return EMPTY;
                }
              })
            );
          }
          return EMPTY;
        })
      )
      .toPromise();
  }

  createSubscriptionCheckout(organization: number, plan: string) {
    const url = baseUrl + "/create-stripe-subscription-checkout/";
    const data = {
      organization,
      plan,
    };
    return this.http.post<StripeCheckoutSession>(url, data);
  }

  /**
   * Redirect the user to Stripe's self service billing portal
   * https://stripe.com/docs/billing/subscriptions/integrating-self-serve-portal
   */
  redirectToBillingPortal() {
    return this.activeOrganizationId$
      .pipe(
        exhaustMap((organization) =>
          this.createBillingPortal(organization!).pipe(
            tap((resp) => (window.location.href = resp.url))
          )
        ),
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
        })
      )
      .toPromise();
  }

  createBillingPortal(organization: number) {
    const url = baseUrl + "/create-billing-portal/";
    const data = {
      organization,
    };
    return this.http.post<StripeBillingPortalSession>(url, data);
  }

  clearState() {
    this.state.next(initialState);
  }
}

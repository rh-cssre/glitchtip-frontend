import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { loadStripe } from "@stripe/stripe-js";
import { EMPTY } from "rxjs";
import { tap, exhaustMap, withLatestFrom } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import {
  StripeCheckoutSession,
  StripeBillingPortalSession,
} from "./stripe.interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SettingsService } from "src/app/api/settings.service";

@Injectable({
  providedIn: "root",
})
export class StripeService {
  activeOrganizationId$ = this.organizationService.activeOrganizationId$;
  stripePublicKey$ = this.settingsService.stripePublicKey$;
  constructor(
    private http: HttpClient,
    private organizationService: OrganizationsService,
    private settingsService: SettingsService
  ) {}

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
        )
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
}

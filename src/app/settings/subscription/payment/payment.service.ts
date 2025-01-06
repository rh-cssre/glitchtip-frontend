import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { catchError, EMPTY, lastValueFrom, tap } from "rxjs";
import { Organization } from "src/app/api/organizations/organizations.interface";
import { SubscriptionsAPIService } from "src/app/api/subscriptions/subscriptions-api.service";
import { BasePrice } from "src/app/api/subscriptions/subscriptions.interfaces";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { StripeService } from "../stripe.service";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor(
    private subscriptionsService: SubscriptionsService,
    private subscriptionsAPIService: SubscriptionsAPIService,
    private stripe: StripeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  dispatchSubscriptionCreation(organization: Organization, price: BasePrice) {
    this.setSubscriptionCreationStart(price.id);
    if (price.unit_amount === 0) {
      lastValueFrom(
        this.subscriptionsAPIService.create(organization.id, price.id).pipe(
          tap((resp) => {
            this.subscriptionsService.setSubscription(resp.subscription);
            this.router.navigate([organization.slug, "issues"]);
          }),
          catchError((err) => {
            if (err.status === 409) {
              this.setSubscriptionCreationError();
              this.snackBar.open(
                "This organization already has a subscription. Please reload page for latest details."
              );
            }
            return EMPTY;
          })
        ),
        { defaultValue: null }
      );
    } else {
      this.stripe.redirectToSubscriptionCheckout(organization.slug, price.id);
    }
  }

  private setSubscriptionCreationStart(subscriptionCreationLoadingId: string) {
    this.subscriptionsService.setState({ subscriptionCreationLoadingId });
  }

  private setSubscriptionCreationError() {
    this.subscriptionsService.setState({ subscriptionCreationLoadingId: null });
  }
}

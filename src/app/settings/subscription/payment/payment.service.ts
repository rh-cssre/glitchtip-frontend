import { computed, Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { SettingsService } from "src/app/api/settings.service";
import { client } from "src/app/shared/api/api";

import { components } from "src/app/api/api-schema";
import { loadStripe } from "@stripe/stripe-js";
import { apiResource } from "src/app/shared/api/api-resource-factory";

type Organization = components["schemas"]["OrganizationDetailSchema"];
export interface Price
  extends Omit<components["schemas"]["StripeNestedPriceSchema"], "price"> {
  price: number;
}

export interface PaymentState {
  subscriptionCreationLoadingId: string | null;
}

const initialState: PaymentState = {
  subscriptionCreationLoadingId: null,
};

@Injectable({
  providedIn: "root",
})
export class PaymentService extends StatefulService<PaymentState> {
  private settingsService = inject(SettingsService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  stripePublicKey = this.settingsService.stripePublicKey;
  readonly subscriptionCreationLoadingId = computed(
    () => this.state().subscriptionCreationLoadingId,
  );

  productsResource = apiResource(() => ({ url: "/api/0/stripe/products/" }));
  products = computed(
    () =>
      this.productsResource
        .value()
        ?.map((product) => ({
          ...product,
          defaultPrice: {
            ...product.defaultPrice,
            price: parseFloat(product.defaultPrice.price),
          },
          name: product.name.startsWith("GlitchTip ")
            ? product.name.slice(10)
            : product.name,
        }))
        .sort(
          (a, b) => (a.defaultPrice.price || 0) - (b.defaultPrice.price || 0),
        ) || [],
  );

  constructor() {
    super(initialState);
  }

  dispatchSubscriptionCreation(organization: Organization, price: Price) {
    this.setSubscriptionCreationStart(price.stripeID);
    if (price.price === 0) {
      this.createFreeSubscription(organization, price.stripeID);
    } else {
      this.redirectToSubscriptionCheckout(organization.slug, price.stripeID);
    }
  }

  private async createFreeSubscription(
    organization: Organization,
    priceId: string,
  ) {
    const { data, error, response } = await client.POST(
      "/api/0/stripe/subscriptions/",
      {
        body: { organization: organization.id, price: priceId },
      },
    );
    if (response.status === 400) {
      this.setSubscriptionCreationError(
        "This organization already has a subscription. Please reload page for latest details.",
      );
      return null;
    }
    if (response.status === 404) {
      this.setSubscriptionCreationError(
        "Only organization owners can choose subscriptions. Make sure you are authorized to perform this action.",
      );
      return null;
    }
    if (error) {
      this.setSubscriptionCreationError(
        "There was an error processing your request. Please try again",
      );
      throw error;
    }
    this.router.navigate([organization.slug, "issues"]);
    return data;
  }

  private async redirectToSubscriptionCheckout(
    orgSlug: string,
    priceId: string,
  ) {
    const stripePublicKey = this.stripePublicKey();
    const { data, error, response } = await client.POST(
      "/api/0/stripe/organizations/{organization_slug}/create-stripe-subscription-checkout/",
      {
        params: { path: { organization_slug: orgSlug } },
        body: { price: priceId },
      },
    );
    if (response.status === 404) {
      this.setSubscriptionCreationError(
        "Only organization owners can choose subscriptions. Make sure you are authorized to perform this action.",
      );
      return null;
    }
    if (error) {
      this.setSubscriptionCreationError(
        "There was an error processing your request. Please try again",
      );
      throw error;
    }
    if (stripePublicKey) {
      return loadStripe(stripePublicKey).then((stripe) =>
        stripe?.redirectToCheckout({ sessionId: data.id }),
      );
    }
    return data;
  }

  private setSubscriptionCreationStart(subscriptionCreationLoadingId: string) {
    this.setState({ subscriptionCreationLoadingId });
  }

  private setSubscriptionCreationError(message: string) {
    this.setState({ subscriptionCreationLoadingId: null });
    this.snackBar.open(message);
  }

  clearState() {
    super.clearState();
    this.productsResource.set(undefined);
  }
}

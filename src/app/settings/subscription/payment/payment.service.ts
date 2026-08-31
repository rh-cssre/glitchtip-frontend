import { computed, Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client } from "src/app/shared/api/api";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";

import { components } from "src/app/api/api-schema";
import { apiResource } from "src/app/shared/api/api-resource-factory";

type Organization = components["schemas"]["OrganizationDetailSchema"];
export interface Price
  extends Omit<components["schemas"]["StripeNestedPriceSchema"], "price"> {
  price: number;
}

export interface Product
  extends Omit<
    components["schemas"]["StripeProductExpandedPriceSchema"],
    "defaultPrice" | "prices"
  > {
  defaultPrice: Price;
  prices: Price[];
  marketingFeatures: string[];
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
  private snackBar = inject(MatSnackBar);
  private subscriptionService = inject(SubscriptionService);

  readonly subscriptionCreationLoadingId = computed(
    () => this.state().subscriptionCreationLoadingId,
  );

  productsResource = apiResource(() => ({ url: "/api/0/stripe/products/" }));
  products = computed<Product[]>(
    () =>
      this.productsResource
        .value()
        ?.map((product) => ({
          ...product,
          defaultPrice: {
            ...product.defaultPrice,
            price: parseFloat(product.defaultPrice.price),
          },
          prices: (product.prices || []).map((p) => ({
            ...p,
            price: parseFloat(p.price),
          })),
          marketingFeatures: product.marketingFeatures || [],
          name: product.name.startsWith("GlitchTip ")
            ? product.name.slice(10)
            : product.name,
          description: product.description
            .replace(/\s*-\s*[Uu]p to .*/i, "")
            .trim(),
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
    this.setState({ subscriptionCreationLoadingId: null });
    this.subscriptionService.subscriptionResource.reload();
    return data;
  }

  private async redirectToSubscriptionCheckout(
    orgSlug: string,
    priceId: string,
  ) {
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
    window.location.href = data.url;
    return data;
  }

  private setSubscriptionCreationStart(subscriptionCreationLoadingId: string) {
    this.setState({ subscriptionCreationLoadingId });
  }

  private setSubscriptionCreationError(message: string) {
    this.setState({ subscriptionCreationLoadingId: null });
    this.snackBar.open(message);
  }

}

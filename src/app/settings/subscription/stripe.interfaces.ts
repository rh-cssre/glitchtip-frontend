interface StripeSession {
  id: string;
  object: string;
  livemode: boolean;
}

export interface StripeBillingPortalSession extends StripeSession {
  created: number;
  customer: string;
  return_url: string;
  url: string;
}

export interface StripeCheckoutSession extends StripeSession {
  cancel_url: string;
  success_url: string;
}

interface BaseProduct {
  id: string;
  name: string;
  description: string;
  type: string;
  metadata: { [key: string]: string };
}

export interface Product extends BaseProduct {
  prices: BasePrice[];
}

export interface BasePrice {
  id: string;
  nickname: string;
  currency: string;
  type: string;
  unit_amount: number;
  human_readable_price: string;
  metadata: { [key: string]: string };
}

export interface Price extends BasePrice {
  product: BaseProduct;
}

interface SubscriptionItem {
  id: number;
  price: Price;
}

export interface Subscription {
  id: string;
  created: string | null;
  collection_method: string | null;
  billing_cycle_anchor: string | null;
  current_period_end: string | null;
  current_period_start: string | null;
  start_date: string | null;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "trialing"
    | "unpaid";
  items: SubscriptionItem[];
}

export interface CreateSubscriptionResp {
  organization: number;
  price: string;
  subscription: Subscription;
}

export interface EventsCount {
  eventCount: number | null;
  transactionEventCount: number | null;
  uptimeCheckEventCount: number | null;
  fileSizeMB: number | null;
}

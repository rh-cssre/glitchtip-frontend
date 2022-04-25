interface BaseProduct {
  id: string;
  name: string;
  description: string;
  type: string;
  metadata: { [key: string]: string };
}

export interface Plan {
  id: string;
  nickname: string;
  amount: number | string;
  metadata: { [key: string]: string };
  product: BaseProduct;
}

export interface Product extends BaseProduct {
  plans: Plan[];
}

export interface Subscription {
  id: string;
  created: string;
  collection_method: string;
  billing_cycle_anchor: string;
  current_period_end: string;
  current_period_start: string;
  start_date: string;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "trialing"
    | "unpaid";
  plan: Plan | null;
}

export interface CreateSubscriptionResp {
  organization: number;
  plan: string;
  subscription: Subscription;
}

export interface EventsCount {
  eventCount: number | null;
  transactionEventCount: number | null;
  uptimeCheckEventCount: number | null;
  fileSizeMB: number | null;
}

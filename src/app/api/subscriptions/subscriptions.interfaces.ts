export interface Plan {
  id: string;
  nickname: string;
  amount: number | string;
  metadata: { [key: string]: string };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  plans: Plan[];
  metadata: { [key: string]: string };
}

export interface Subscription {
  id: string;
  created: string;
  collection_method: string;
  billing_cycle_anchor: string;
  current_period_end: string;
  current_period_start: string;
  start: string;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "trialing"
    | "unpaid";
  plan: Plan;
}

export interface CreateSubscriptionResp {
  organization: number;
  plan: string;
  subscription: Subscription;
}

export interface Plan {
  id: string;
  nickname: string;
  amount: string;
  metadata: { [key: string]: string };
}

export interface Subscription {
  id: string;
  created: string;
  billing: string;
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

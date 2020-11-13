import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { moduleMetadata } from "@storybook/angular";
import { withKnobs, boolean, select, number } from "@storybook/addon-knobs";
import { of } from "rxjs";
import { SharedModule } from "../../shared/shared.module";
import { SubscriptionComponent } from "./subscription.component";
import { PaymentComponent } from "./payment/payment.component";

export default {
  title: "Subscription",
  decorators: [
    moduleMetadata({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [PaymentComponent],
    }),
    withKnobs,
  ],
};

const subscriptions = [
  {
    djstripe_id: 3,
    plan: {
      id: "plan_HKImiWbwKcc4Px",
      nickname: "Free",
      amount: "0.00",
      metadata: {},
    },
    id: "sub_HLmiXGBoLgNPc6",
    livemode: false,
    created: "2020-05-26T15:57:19Z",
    metadata: {},
    description: "",
    djstripe_created: "2020-05-26T15:57:20.009982Z",
    djstripe_updated: "2020-05-26T16:48:22.193423Z",
    application_fee_percent: null,
    billing_cycle_anchor: "2020-05-26T15:57:19Z",
    cancel_at_period_end: true,
    canceled_at: "2020-05-26T16:48:03Z",
    collection_method: "charge_automatically",
    current_period_end: "2020-06-26T15:57:19Z",
    current_period_start: "2020-05-26T15:57:19Z",
    days_until_due: null,
    discount: null,
    ended_at: null,
    next_pending_invoice_item_invoice: null,
    pending_invoice_item_interval: null,
    pending_update: null,
    quantity: 1,
    start: "2020-05-26T16:48:03Z",
    start_date: "2020-05-26T15:57:19Z",
    status: "active",
    tax_percent: null,
    trial_end: null,
    trial_start: null,
    customer: 99,
    default_payment_method: null,
    default_source: null,
    pending_setup_intent: null,
  },
  {
    djstripe_id: 2,
    plan: {
      id: "plan_GuB1PFhW5NKkfo",
      nickname: "Small - 100k events",
      amount: "15.00",
      metadata: {
        max_events: "1001",
      },
    },
    id: "sub_GuT4Y76LY9PeRU",
    livemode: false,
    created: "2020-03-14T17:51:17Z",
    metadata: {},
    description: "",
    djstripe_created: "2020-03-23T15:42:05.692166Z",
    djstripe_updated: "2020-05-26T19:10:46.937603Z",
    application_fee_percent: null,
    billing_cycle_anchor: "2020-03-14T17:51:17Z",
    cancel_at_period_end: false,
    canceled_at: null,
    collection_method: "send_invoice",
    current_period_end: "2020-04-14T17:51:17Z",
    current_period_start: "2020-03-14T17:51:17Z",
    days_until_due: 30,
    discount: null,
    ended_at: null,
    next_pending_invoice_item_invoice: null,
    pending_invoice_item_interval: null,
    pending_update: null,
    quantity: 1,
    start: "2020-03-14T17:51:17Z",
    start_date: null,
    status: "trialing",
    tax_percent: null,
    trial_end: null,
    trial_start: null,
    customer: 1,
    default_payment_method: null,
    default_source: null,
    pending_setup_intent: null,
  },
  {
    id: "",
    livemode: null,
    created: null,
    metadata: null,
    description: "",
    application_fee_percent: null,
    billing_cycle_anchor: null,
    cancel_at_period_end: false,
    canceled_at: null,
    collection_method: null,
    current_period_end: null,
    current_period_start: null,
    days_until_due: null,
    discount: null,
    ended_at: null,
    next_pending_invoice_item_invoice: null,
    pending_invoice_item_interval: null,
    pending_update: null,
    quantity: null,
    start: null,
    start_date: null,
    status: null,
    tax_percent: null,
    trial_end: null,
    trial_start: null,
    customer: null,
    default_payment_method: null,
    default_source: null,
    pending_setup_intent: null,
  },
];

const plans = [
  {
    id: "plan_HKImiWbwKcc4Px",
    nickname: "Free",
    amount: "0.00",
    metadata: {},
  },
  {
    id: "plan_GuB1PFhW5NKkfo",
    nickname: "Small - 100k events",
    amount: "15.00",
    metadata: {
      max_events: "1001",
    },
  },
  {
    id: "plan_GuB1PFhW5NKkfo",
    nickname: "Less Small",
    amount: "30.00",
    metadata: {
      max_events: "10001",
    },
  },
  {
    id: "plan_HKImiWbwKcc4Px",
    nickname: "Large",
    amount: "250.00",
    metadata: {
      max_events: "100001",
      support: "10 hours",
    },
  },
  {
    id: "plan_GuB1PFhW5NKkfo",
    nickname: "Gargantuan",
    amount: "300.00",
    metadata: {
      max_events: "unlimited",
      support: "unlimited",
    },
  },
];

export const subscription = () => {
  const subOptions = ["Free", "Small - 100k", "None"];

  const subOption = select("Subscription Type", subOptions, subOptions[0]);
  let option: any = subscriptions[0];

  switch (subOption) {
    case "Free":
      option = subscriptions[0];
      break;
    case "Small - 100k":
      option = subscriptions[1];
      break;
    case "None":
      option = subscriptions[2];
      break;
  }
  return {
    component: SubscriptionComponent,
    props: {
      subscription$: of(option),
      billingEmail: "billing@mail.glitchtip.com",
    },
  };
};

subscription.story = {
  name: "Subscription Page",
};

export const planOptions = () => {
  const numberPicker = number("Number of options", 2, {
    range: true,
    min: 1,
    max: 5,
  });
  const showPlans = plans.slice(0, numberPicker);
  return {
    component: PaymentComponent,
    props: {
      planOptions$: of(showPlans),
      isLoading: boolean("loading", false),
      billingEmail: "billing@mail.glitchtip.com",
    },
  };
};

planOptions.story = {
  name: "Plan Options",
};

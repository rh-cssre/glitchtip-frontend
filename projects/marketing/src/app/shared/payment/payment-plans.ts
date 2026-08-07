export interface PlanFeature {
  text: string;
  tooltip?: string;
}

export interface PlanOption {
  name: string;
  subtitle: string;
  includesFrom?: string;
  features: PlanFeature[];
  monthlyPrice: number | "Free" | "Custom";
  annualPrice?: number | "Custom";
  priceSuffix?: string;
  ctaText?: string;
  ctaUrl?: string;
  // Self-serve Stripe Payment Links, one per billing interval. When set, the
  // CTA links to the interval matching the monthly/annual toggle instead of
  // ctaUrl.
  paymentLinks?: { monthly: string; annual: string };
}

export const planOptions: PlanOption[] = [
  {
    name: "Hobby & Trial",
    subtitle: "Explore features or build side projects",
    features: [
      { text: "Up to 1,000 events/mo" },
      { text: "Error tracking" },
      { text: "30 days of event retention"},
      { text: "Ideal for testing before upgrading"}
    ],
    monthlyPrice: "Free",
  },
  {
    name: "Small",
    subtitle: "For small teams",
    includesFrom: "Hobby & Trial",
    features: [
      { text: "Up to 100k events/mo" },
      { text: "90 days of event retention"},
      { text: "Unlimited projects" },
      { text: "Unlimited team members" },
      { text: "Support access" },
    ],
    monthlyPrice: 15,
    annualPrice: 150,
  },
  {
    name: "Medium",
    subtitle: "For growing businesses",
    includesFrom: "Small",
    features: [
      { text: "Up to 500k events/mo" },
      { text: "Priority email & live chat support" },
    ],
    monthlyPrice: 50,
    annualPrice: 500,
  },
  {
    name: "Large",
    subtitle: "For large scaling organizations",
    includesFrom: "Medium",
    features: [
      { text: "Up to 3 million events/mo" },
      { text: "Development support & prioritization" },
      { text: "Business Associate Agreement (BAA) available upon request" },
    ],
    monthlyPrice: 250,
    annualPrice: 2500,
  },
];

export const selfHostedPlanOptions: PlanOption[] = [
  {
    name: "Starter Edition",
    subtitle: "For personal use and open source projects",
    features: [
      { text: "Unlimited usage" },
      { text: "Host on your infrastructure" },
      { text: "Unlimited projects" },
    ],
    monthlyPrice: "Free",
    ctaText: "Get started",
    ctaUrl: "https://glitchtip.com/documentation/install",
  },
  {
    name: "Individual License",
    subtitle: "Developer use for 1 user",
    includesFrom: "Starter",
    features: [{ text: "Support access for 1 user" }],
    monthlyPrice: 5,
    annualPrice: 50,
    ctaText: "Subscribe",
    ctaUrl: "https://glitchtip.com/documentation/install",
    paymentLinks: {
      monthly: "https://buy.stripe.com/14A4gA9Ifa3Iazyfpnds406",
      annual: "https://buy.stripe.com/fZufZiaMj5NsfTS7WVds405",
    },
  },
  {
    name: "Commercial License",
    subtitle: "For business use",
    includesFrom: "Individual",
    features: [
      { text: "Team support access: priority email & live chat + update assistance" },
    ],
    monthlyPrice: 15,
    annualPrice: 150,
    priceSuffix: "/user/month",
    ctaText: "Subscribe",
    ctaUrl: "mailto:support@glitchtip.com",
    paymentLinks: {
      monthly: "https://buy.stripe.com/fZu4gAaMj3FkdLKa53ds408",
      annual: "https://buy.stripe.com/9B6aEYbQn2BggXW2CBds407",
    },
  },
  {
    name: "Scaled Support",
    subtitle: "For large organizations and regulated industries (10 user minimum)",
    includesFrom: "Commercial",
    features: [
      { text: "Custom Branding" },
      { text: "Single Sign-On integration" },
      { text: "Development support & prioritization" },
    ],
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    ctaText: "Contact sales",
    ctaUrl: "mailto:support@glitchtip.com",
  },
];

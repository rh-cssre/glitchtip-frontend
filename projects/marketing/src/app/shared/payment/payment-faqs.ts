export interface Faq {
  question: string;
  answer: string;
}

export const hostedFaqs: Faq[] = [
  {
    question: "What is an event?",
    answer:
      "Almost everything GlitchTip records counts toward your monthly events. Each error and each performance transaction counts as one event. Uptime checks and logs are lighter: ten of either count as one event. Release and debug file uploads count as one event per megabyte. Your plan sets how many events your organization can use each month.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Our Free plan is free forever with up to 1,000 events per month. You can upgrade to a paid plan at any time.",
  },
  {
    question: "What happens when I exceed my event limit?",
    answer:
      "You're in control. By default we throttle: once your limit is full we start dropping about 10% of events, then more as usage climbs, blocking fully at twice your limit. We email your organization's billing contact when throttling starts. You can upgrade your plan at any time, or turn on on-demand billing to keep collecting events past your limit, paying only for what goes over, up to a monthly spend cap you set.",
  },
  {
    question: "How does on-demand billing work?",
    answer:
      'On-demand billing is opt-in and available on any paid plan with an event limit. Turn it on, and events past your limit keep flowing, billed at $0.17 per 1,000 for the first million events over, $0.15 per 1,000 up to ten million, and $0.12 per 1,000 after that. Pricing is per event, so 200,000 extra events cost $34. You also set a monthly spend cap: overage billing stops the moment you reach it, so the overage on your invoice can never pass your cap. Your plan price stays the same and is billed as usual. See the details in our <a href="/documentation/on-demand-billing">on-demand billing docs</a>.',
  },
  {
    question: "Can I change plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      'Yes. Every plan above has a Monthly/Annual toggle, and annual plans are discounted. For invoicing or contract arrangements, contact us at <a href="mailto:support@glitchtip.com">support@glitchtip.com</a>.',
  },
  {
    question: "Can I choose where my data is hosted?",
    answer:
      "Yes, we offer hosting in both the US and EU (Germany). All plans are available on our EU instance for data sovereignty requirements.",
  },
  {
    question: "Do you offer discounts for non-profits or open source projects?",
    answer:
      'Yes, we offer discounted plans for non-profits and open source projects starting at $5 per month. Contact us at <a href="mailto:support@glitchtip.com">support@glitchtip.com</a>.',
  },
  {
    question: "What payment methods do you accept?",
    answer:
      'We accept all major credit cards through our payment processor. For annual plans, invoicing, or contract-based arrangements, contact us at <a href="mailto:support@glitchtip.com">support@glitchtip.com</a>.',
  },
  {
    question:
      "What's the difference between the Medium and Large plans?",
    answer:
      "In addition to increased event limits, the Large plan includes development support & prioritization, as well as a Business Associate Agreement (BAA) available upon request, while Medium plan support includes only priority email & live chat support.",
  },
];

export const selfHostedFaqs: Faq[] = [
  {
    question: "Is GlitchTip really free to self-host?",
    answer:
      "Yes. GlitchTip is free to self-host with unlimited events, projects, and team members. No paid plan is required. If your business uses GlitchTip in production, we expect you to purchase a license to support continued development.",
  },
  {
    question: "Do I need a Commercial License to use GlitchTip at work?",
    answer:
      "If your business uses GlitchTip at work, purchasing a Commercial License is expected. There are no premium features — what you're paying for is support.",
  },
  {
    question: "What's included in the Commercial License?",
    answer:
      "The Commercial License includes team support access — priority email & live chat support and update assistance.",
  },
  {
    question: "How do I install GlitchTip?",
    answer:
      "GlitchTip can be installed on your own infrastructure using Docker. See our installation documentation for step-by-step guides.",
  },
  {
    question: "What are the system requirements?",
    answer:
      "GlitchTip requires Docker and a PostgreSQL database. It runs on any platform that supports Docker containers, including Linux, AWS, DigitalOcean, and Heroku.",
  },
  {
    question: "Can I get HIPAA compliance with self-hosted?",
    answer:
      "Yes. Since you control the infrastructure, you are responsible for your own security controls, BAAs with sub-processors, and compliance obligations. GlitchTip's open-source codebase is fully auditable.",
  },
  {
    question: "How is self-hosted pricing different from hosted?",
    answer:
      "Self-hosted pricing is per-user rather than per-event. The Starter Edition is free. Commercial and Scaled Support plans are billed per user per month, with annual billing discounts available. Scaled Support requires a 10-user minimum for contract-based arrangements.",
  },
  {
    question: "Will GlitchTip's license ever change?",
    answer:
      "GlitchTip will remain open source under the MIT license. We are committed to keeping it that way.",
  },
  {
    question:
      "What's the difference between Starter Edition and Commercial License?",
    answer:
      "The Starter Edition is free and includes everything GlitchTip offers. If you're running it in production, we expect you to hold a Commercial License — that's what gets you update assistance and priority support from us.",
  },
  {
    question: "Can I migrate from hosted to self-hosted (or vice versa)?",
    answer:
      'Yes. Contact us at <a href="mailto:support@glitchtip.com">support@glitchtip.com</a> and we can assist with migrating your data between hosted and self-hosted instances.',
  },
  {
    question: "How do updates work for self-hosted?",
    answer:
      "You can update GlitchTip yourself at any time by pulling the latest Docker image.",
  },
  {
    question: "Do you offer training or onboarding?",
    answer:
      "With Scaled Support, we can join your company's chat service such as Slack or Rocket.Chat to help your team get started. We'll help you integrate your apps and prioritize development requests.",
  },
];

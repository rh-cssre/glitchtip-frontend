# On-Demand Billing

On-demand billing lets a hosted GlitchTip organization keep ingesting events after it passes its plan quota, instead of being throttled. You pay only for the events above your quota, and you set a monthly spend cap so your bill can never go over the amount you choose.

It is opt-in, off by default, and available on any paid plan. In your subscription settings it is labeled "Overage billing".

## What happens when you exceed your quota

By default, GlitchTip throttles. Once your quota is full we start dropping about 10% of events and increase that gradually, blocking fully at twice your quota. Nothing here changes unless you turn on on-demand billing.

With on-demand billing on, events above your quota keep flowing and are billed as you use them, up to your cap. When you reach the cap, billing stops and throttling resumes for the rest of the cycle. Your bill never goes over your cap.

## How you're charged

Events above your plan quota are billed per 1,000 events on a tiered scale:

| Events over quota | Price per 1,000 |
| --- | --- |
| First 1,000,000 | $0.17 |
| 1,000,000 to 10,000,000 | $0.15 |
| Above 10,000,000 | $0.12 |

Each tier prices only the events that fall within it, the same way income tax brackets work. Charges appear on your regular Stripe invoice, which is always the source of truth for what you actually owe.

## Setting your spend cap

You choose a monthly cap when you turn on on-demand billing, and you can change it anytime from your subscription settings. The cap is a hard ceiling on overage spend. Once your usage reaches it, we stop billing and resume throttling, so you are never charged more than the cap in a billing cycle. The cap resets at the start of each billing cycle.

## Turning it on

Only organization owners can turn on on-demand billing. Open Settings, go to Subscription, and use the Overage billing toggle. Turning it on switches your subscription to Stripe's flexible billing mode. This is a one-way change: you can turn on-demand billing off again, but the subscription stays in flexible mode.

## Common questions

### Can my bill surprise me?

No. The cap is a hard limit. At the cap we throttle instead of charging more.

### Where do I see what I have actually been charged?

Your Stripe invoice and billing portal show the real charges. The estimate in your subscription settings is based on current usage and may differ slightly from the final invoice.

### Does this apply to self-hosted?

No. On-demand billing is for hosted GlitchTip plans.

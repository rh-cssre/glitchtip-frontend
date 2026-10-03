# On-Demand Billing

On-demand billing lets a hosted GlitchTip organization keep collecting events after it passes its plan limit, instead of being throttled. You pay only for the events above your limit, and you set a monthly spend cap so the extra spend stops at an amount you choose.

It is opt-in, off by default, and available on any paid plan with an event limit. In your subscription settings it is labeled "Overage billing".

## What happens when you pass your limit

By default, GlitchTip throttles. Past your limit we drop about 10% of events, at one and a half times your limit we drop about half, and at twice your limit we block fully. We email your organization's billing contact when throttling starts. Nothing here changes unless you turn on on-demand billing.

With on-demand billing on, events above your limit keep flowing and are billed as you use them, up to your cap. When you reach the cap, billing stops and throttling ramps back in for the rest of the cycle. Any events accepted while throttling ramps in are free: once you hit the cap, nothing more is charged that cycle.

## What counts as an event

Overage uses the same event math as your plan limit. Each error and each performance transaction counts as one event. Uptime checks and logs are lighter: ten of either count as one event. Release and debug file uploads count as one event per megabyte.

## How you're charged

Events above your plan limit are priced per event, quoted per 1,000 for readability. You pay for exactly the events you use:

| Events over your limit | Price per 1,000 |
| --- | --- |
| First 1,000,000 | $0.17 |
| 1,000,000 to 10,000,000 | $0.15 |
| Above 10,000,000 | $0.12 |

Each tier prices only the events that fall within it, the same way income tax brackets work.

Here is a worked example. You're on the Small plan (100,000 events) and a bad deploy sends 300,000 events in one month. The extra 200,000 events cost $34. If your cap is $50, you pay $34. If the deploy had been far worse, $50 is the most the overage could ever be.

Overage charges appear on your regular Stripe invoice at the end of each usage cycle, on top of your plan price. Your invoice shows exactly what you owe. The figure in your subscription settings is an estimate, and where the two differ our billing is designed to err toward charging you less, not more.

## Setting your spend cap

You choose a monthly cap when you turn on on-demand billing, and you can change it anytime from your subscription settings. Caps up to $10,000 per cycle are self-serve; contact us if you need more.

Raising the cap takes effect right away. Lowering it applies to future usage only: overage already billed this cycle stays on your invoice, so a mid-cycle decrease can't drop below what you've already used. Your spend against the cap resets at the start of each usage cycle; the cap itself stays until you change it.

## Annual plans

Annual plans meter usage in monthly cycles, the same as monthly plans. Your event limit and your spend cap both apply per month, and any overage is invoiced monthly, separate from your annual plan payment.

## Turning it on and off

Only organization owners can turn on on-demand billing. Open Settings, go to Subscription, and use the Overage billing toggle.

Two things to know:

- If you turn it on partway through a cycle while already over your limit, the events accepted above your limit earlier in that cycle are billed too, up to your cap.
- You can turn it off at any time. Overage already used this cycle still appears on that cycle's invoice; nothing new is billed after you turn it off.

## Common questions

### Can my bill surprise me?

No. Your invoice is your plan price plus overage. Once you reach the cap, no further overage is charged and throttling resumes. The one thing to keep in mind is that lowering the cap mid-cycle does not reduce overage already used.

### Will you warn me before I hit my cap?

Your subscription settings show usage against your cap, including a projection for the month, so you can see a spike coming. We also email your organization's billing contact when throttling begins, which with on-demand billing on means you've reached your cap.

### I hit my cap and raised it. Do events start flowing again?

Yes. Raising the cap triggers an immediate re-check, so event intake resumes within a minute or two.

### Where do I see what I have actually been charged?

Your Stripe invoice and billing portal show the real charges. The estimate in your subscription settings is based on current usage and may differ slightly from the final invoice.

### Does this apply to self-hosted?

No. On-demand billing is for hosted GlitchTip plans.

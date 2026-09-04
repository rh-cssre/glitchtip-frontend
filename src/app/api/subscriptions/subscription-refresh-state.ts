/**
 * Whether to show the "we could not find your subscription" notice after a
 * return from Stripe checkout.
 *
 * Derived rather than stored. The poll gives up a few seconds in, but the
 * subscription can still arrive afterwards: the giving-up tick starts a reload
 * before it clears the timer, switching organization refetches the resource,
 * and configuring overage reloads it too. A flag cleared by the poll itself
 * would miss all three and leave the notice covering a subscription that
 * loaded, which is what it used to do.
 */
export function showSubscriptionRefreshTimeout(
  timedOut: boolean,
  hasSubscription: boolean,
): boolean {
  return timedOut && !hasSubscription;
}

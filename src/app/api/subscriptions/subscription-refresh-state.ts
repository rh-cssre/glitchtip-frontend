/**
 * Whether to show the post-checkout "no subscription found" notice. Derived,
 * since the subscription can arrive after the poll gives up.
 */
export function showSubscriptionRefreshTimeout(
  timedOutOrgSlug: string | null,
  currentOrgSlug: string,
  hasSubscription: boolean,
): boolean {
  return timedOutOrgSlug === currentOrgSlug && !hasSubscription;
}

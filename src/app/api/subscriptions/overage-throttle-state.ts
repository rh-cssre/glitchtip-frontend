import type { components } from "../api-schema";

type OverageStatus = components["schemas"]["OverageStatusSchema"];

/**
 * Why an organization's events are being dropped, and whether the overage
 * controls can do anything about it.
 */
export type OverageThrottleState =
  /** Overage status has not loaded. */
  | "unknown"
  /** Not throttled: every event is being accepted. */
  | "none"
  /** Throttled with overage off but available. Turning it on creates headroom. */
  | "no-overage"
  /** Throttled with overage off and not available to this org at all. */
  | "unavailable"
  /** Throttled with overage live and a raisable cap reached. Raising it helps. */
  | "cap"
  /** Throttled with overage live but no raisable cap to blame. */
  | "throttled"
  /** Throttled with overage on, but the plan cannot be billed for it. */
  | "stalled-plan"
  /** Throttled with overage on and billable, but the server is not running it. */
  | "stalled-broken";

/**
 * Overage reads "on" but is granting no headroom. `active` is the predicate the
 * throttle task enforces, so this cannot drift from the server.
 *
 * Tested against `false`, not falsy: a server that does not serve the field
 * omits it, and reading that as "not running" would send every enrolled org to
 * support.
 */
export function isOverageInactive(status: OverageStatus | null): boolean {
  if (!status) return false;
  return status.enabled && status.active === false;
}

/**
 * Whose problem an inactive overage is: an ineligible plan is a consequence of
 * the customer's own change, an eligible one means the metered item has gone
 * from Stripe, which they cannot fix and are not being billed for. Separate
 * from `overageThrottleState` because the cause is known before throttling
 * starts, and that only answers what remedy to offer an already-throttled org.
 */
export function overageInactiveCause(
  status: OverageStatus | null,
): "plan" | "broken" | null {
  if (!status || !isOverageInactive(status)) return null;
  return status.eligible ? "broken" : "plan";
}

/**
 * The spend cap can actually be changed. Both terms are enforced by the
 * configure endpoint, which an adjustment hits with `enabled: true`: an
 * ineligible plan is rejected outright, and with no live overage price the
 * request is rejected even when it only lowers the cap. Never name the cap as
 * a remedy without this.
 */
export function capAdjustable(status: OverageStatus | null): boolean {
  if (!status) return false;
  return status.eligible && status.configured;
}

/** Usage has consumed the spend cap. Only meaningful with overage enabled. */
export function capReached(status: OverageStatus | null): boolean {
  if (!status || !status.enabled) return false;
  return status.capUnits > 0 && status.overageUnits >= status.capUnits;
}

/**
 * Only `active` says overage is not working. `throttleRate` is written by a
 * background sweep while usage and the cap are computed per request, so
 * inferring it from usage below the cap reads across a lagging value.
 */
export function overageThrottleState(
  status: OverageStatus | null,
): OverageThrottleState {
  if (!status) return "unknown";
  if (!status.throttleRate) return "none";
  // Both conditions are what the enable endpoint itself checks, so offering the
  // toggle without them is a dead end.
  if (!status.enabled) {
    return status.eligible && status.configured ? "no-overage" : "unavailable";
  }
  // Both mean "no headroom" but need different remedies: an ineligible plan
  // is the customer's own change, while an eligible-but-inactive one means
  // the metered item has gone from Stripe, which they cannot fix.
  const cause = overageInactiveCause(status);
  if (cause) return cause === "broken" ? "stalled-broken" : "stalled-plan";
  // "cap" is a remedy claim, so it needs the cap to be changeable, not just
  // reached. An archived overage price and an ineligible plan both freeze it,
  // and until the server serves `active` an ineligible plan lands here rather
  // than in "stalled-plan".
  return capReached(status) && capAdjustable(status) ? "cap" : "throttled";
}

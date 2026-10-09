import { describe, it, expect } from "vitest";
import type { components } from "../api-schema";
import {
  capAdjustable,
  capBelowBilled,
  capReached,
  isOverageInactive,
  overageInactiveCause,
  overageThrottleState,
  overageCardVisible,
  reportedCostOwedCents,
} from "./overage-throttle-state";

/**
 * This is the logic behind the remedy the overage card and the over-limit
 * snackbar offer. Getting it wrong points a throttled customer at a control
 * that cannot help, so each state is pinned down here.
 */

type OverageStatus = components["schemas"]["OverageStatusSchema"];

/** A healthy paid org, well inside its quota and not throttled. */
const status = (overrides: Partial<OverageStatus> = {}): OverageStatus => ({
  enabled: true,
  eligible: true,
  configured: true,
  active: true,
  capCents: 5000,
  maxCapCents: 1000000,
  capUnits: 294117,
  quota: 500000,
  usage: 400000,
  overageUnits: 0,
  overageCostCents: 0,
  throttleRate: 0,
  ...overrides,
});

describe("overageThrottleState", () => {
  it("is unknown before the status loads", () => {
    expect(overageThrottleState(null)).toBe("unknown");
  });

  it("is none while events are flowing", () => {
    expect(overageThrottleState(status())).toBe("none");
  });

  it("offers overage when a throttled org has it switched off", () => {
    expect(
      overageThrottleState(
        status({ enabled: false, throttleRate: 100, overageUnits: 50000 }),
      ),
    ).toBe("no-overage");
  });

  it("does not offer overage to a throttled org whose plan cannot take it", () => {
    expect(
      overageThrottleState(
        status({ enabled: false, eligible: false, throttleRate: 100 }),
      ),
    ).toBe("unavailable");
  });

  it("does not offer overage when the server has no overage price", () => {
    expect(
      overageThrottleState(
        status({ enabled: false, configured: false, throttleRate: 100 }),
      ),
    ).toBe("unavailable");
  });

  it("blames the cap when a live overage org is throttled", () => {
    expect(
      overageThrottleState(status({ throttleRate: 100, overageUnits: 294117 })),
    ).toBe("cap");
  });

  it("blames the plan when it is the plan that cannot be billed", () => {
    expect(
      overageThrottleState(
        status({
          eligible: false,
          active: false,
          throttleRate: 100,
          overageUnits: 50000,
        }),
      ),
    ).toBe("stalled-plan");
  });

  // Cancelling and resubscribing leaves the opt-in set with no metered item in
  // Stripe. Every other field still reads healthy, so only the server's own
  // predicate can see it.
  it("owns the fault when the plan qualifies but overage is not running", () => {
    expect(
      overageThrottleState(
        status({ active: false, throttleRate: 100, overageUnits: 50000 }),
      ),
    ).toBe("stalled-broken");
  });

  it("reads partial throttling as throttling", () => {
    expect(
      overageThrottleState(status({ throttleRate: 10, overageUnits: 294117 })),
    ).toBe("cap");
  });

  it("does not blame the cap when usage sits below a freshly raised cap", () => {
    expect(
      overageThrottleState(
        status({ throttleRate: 100, overageUnits: 50000, capUnits: 588235 }),
      ),
    ).toBe("throttled");
  });

  it("names the cap only once usage has reached it", () => {
    expect(
      overageThrottleState(
        status({ throttleRate: 100, overageUnits: 294117, capUnits: 294117 }),
      ),
    ).toBe("cap");
    expect(
      overageThrottleState(
        status({ throttleRate: 100, overageUnits: 294116, capUnits: 294117 }),
      ),
    ).toBe("throttled");
  });

  it("does not blame the cap when the archived overage price locks it", () => {
    expect(
      overageThrottleState(
        status({ configured: false, throttleRate: 100, overageUnits: 294117 }),
      ),
    ).toBe("throttled");
  });

  // Until the server serves `active`, an org enrolled before it lost
  // eligibility reads healthy here. It must not be pointed at a cap the
  // configure endpoint would reject, which is what the card used to offer.
  it("does not blame the cap when the plan cannot be billed, with no `active`", () => {
    expect(
      overageThrottleState(
        status({
          active: undefined,
          eligible: false,
          throttleRate: 100,
          overageUnits: 294117,
        }),
      ),
    ).toBe("throttled");
  });
});

describe("capAdjustable", () => {
  it("is false before the status loads", () => {
    expect(capAdjustable(null)).toBe(false);
  });

  it("is true for a billable org on a provisioned server", () => {
    expect(capAdjustable(status())).toBe(true);
  });

  // Both are rejections from the configure endpoint, which a cap adjustment
  // reaches with `enabled: true`.
  it("is false when the plan cannot be billed for overage", () => {
    expect(capAdjustable(status({ eligible: false }))).toBe(false);
  });

  it("is false when the server has no live overage price", () => {
    expect(capAdjustable(status({ configured: false }))).toBe(false);
  });
});

describe("capReached", () => {
  it("is false before the status loads", () => {
    expect(capReached(null)).toBe(false);
  });

  it("is false when overage is off, whatever the numbers say", () => {
    expect(capReached(status({ enabled: false, overageUnits: 294117 }))).toBe(
      false,
    );
  });

  it("is false with no cap set", () => {
    expect(capReached(status({ capUnits: 0, overageUnits: 50000 }))).toBe(
      false,
    );
  });

  it("is true once overage units consume the cap", () => {
    expect(capReached(status({ overageUnits: 294117 }))).toBe(true);
  });
});

describe("isOverageInactive", () => {
  it("is false before the status loads", () => {
    expect(isOverageInactive(null)).toBe(false);
  });

  it("is false when overage is off", () => {
    expect(isOverageInactive(status({ enabled: false }))).toBe(false);
  });

  it("is false when overage is off and never became active", () => {
    expect(isOverageInactive(status({ enabled: false, active: false }))).toBe(
      false,
    );
  });

  it("is false for a working setup", () => {
    expect(isOverageInactive(status())).toBe(false);
  });

  it("is true when the server reports overage is granting no headroom", () => {
    expect(isOverageInactive(status({ active: false }))).toBe(true);
  });

  // A server without the field omits it. Reading that as "not running" would
  // send every enrolled org to support, so an absent value means healthy.
  it("is false when the server does not serve the field", () => {
    expect(isOverageInactive(status({ active: undefined }))).toBe(false);
  });

  // `configured` reports whether an overage price exists for new enrolments.
  // Archiving it does not detach metered items already attached, so the server
  // keeps `active` true and the org keeps accruing cost.
  it("is false when only the overage price is gone", () => {
    expect(isOverageInactive(status({ configured: false }))).toBe(false);
  });
});

describe("overageInactiveCause", () => {
  it("is null before the status loads", () => {
    expect(overageInactiveCause(null)).toBe(null);
  });

  it("is null for a working setup", () => {
    expect(overageInactiveCause(status())).toBe(null);
  });

  it("blames the plan when it cannot be billed", () => {
    expect(
      overageInactiveCause(status({ active: false, eligible: false })),
    ).toBe("plan");
  });

  // The regression: a resubscribe leaves overage on with no metered item, and
  // the tagline blamed the plan until the first throttle sweep had run.
  it("blames us on a billable plan, throttled or not", () => {
    expect(overageInactiveCause(status({ active: false }))).toBe("broken");
    expect(
      overageInactiveCause(status({ active: false, throttleRate: 50 })),
    ).toBe("broken");
  });
});

describe("capBelowBilled", () => {
  it("is false before the status loads", () => {
    expect(capBelowBilled(null)).toBe(false);
  });

  it("is false while the cap still covers what has been billed", () => {
    expect(capBelowBilled(status({ overageCostCents: 102 }))).toBe(false);
  });

  it("is false with no cap set", () => {
    expect(capBelowBilled(status({ capCents: 0, overageCostCents: 102 }))).toBe(
      false,
    );
  });

  // The regression: usage keeps arriving while throttling ramps in, so a
  // reached cap always has usage past it. That usage is free, and the cap was
  // never lowered.
  it("is false at a reached cap with usage past it", () => {
    expect(
      capBelowBilled(status({ overageUnits: 300000, overageCostCents: 5000 })),
    ).toBe(false);
  });

  it("is true once the cap is lowered below what has been billed", () => {
    expect(
      capBelowBilled(status({ capCents: 100, overageCostCents: 102 })),
    ).toBe(true);
  });

  // Overage off is the other disclosure's job; this one explains a cap bar
  // that is only drawn while overage is live.
  it("is false when overage is switched off", () => {
    expect(
      capBelowBilled(
        status({ enabled: false, capCents: 100, overageCostCents: 102 }),
      ),
    ).toBe(false);
  });
});

describe("reportedCostOwedCents", () => {
  it("is zero before the status loads", () => {
    expect(reportedCostOwedCents(null)).toBe(0);
  });

  it("is zero while overage is live", () => {
    expect(reportedCostOwedCents(status({ reportedCostCents: 102 }))).toBe(0);
  });

  it("is what was reported once overage is switched off", () => {
    expect(
      reportedCostOwedCents(status({ enabled: false, reportedCostCents: 102 })),
    ).toBe(102);
  });

  it("is what was reported when the plan can no longer be billed", () => {
    expect(
      reportedCostOwedCents(
        status({ eligible: false, active: false, reportedCostCents: 102 }),
      ),
    ).toBe(102);
  });

  it("is zero when overage is off and nothing was reported", () => {
    expect(
      reportedCostOwedCents(status({ enabled: false, reportedCostCents: 0 })),
    ).toBe(0);
  });

  it("is zero against a server that does not serve the field", () => {
    expect(reportedCostOwedCents(status({ enabled: false }))).toBe(0);
  });
});

describe("overageCardVisible", () => {
  it("is hidden before the status loads", () => {
    expect(overageCardVisible(null)).toBe(false);
  });

  it("shows for a paid org that can turn it on", () => {
    expect(overageCardVisible(status({ enabled: false }))).toBe(true);
  });

  it("shows while it is on, even on a plan that no longer supports it", () => {
    expect(overageCardVisible(status({ eligible: false, active: false }))).toBe(
      true,
    );
  });

  it("is hidden when it is off, unavailable and nothing is owed", () => {
    expect(
      overageCardVisible(
        status({ enabled: false, eligible: false, reportedCostCents: 0 }),
      ),
    ).toBe(false);
  });

  // The regression: switching it off after a downgrade hid the only place
  // the amount still billed is shown.
  it("shows while a reported amount is still owed", () => {
    expect(
      overageCardVisible(
        status({ enabled: false, eligible: false, reportedCostCents: 102 }),
      ),
    ).toBe(true);
    expect(
      overageCardVisible(
        status({ enabled: false, configured: false, reportedCostCents: 102 }),
      ),
    ).toBe(true);
  });
});

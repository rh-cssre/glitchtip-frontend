import { describe, it, expect } from "vitest";
import { showSubscriptionRefreshTimeout } from "./subscription-refresh-state";

/**
 * The notice tells a customer who has just paid that their subscription is
 * missing, so it must disappear the moment one exists, however it arrived.
 */
describe("showSubscriptionRefreshTimeout", () => {
  it("is hidden before the poll gives up", () => {
    expect(showSubscriptionRefreshTimeout(false, false)).toBe(false);
  });

  it("shows once the poll gives up with nothing loaded", () => {
    expect(showSubscriptionRefreshTimeout(true, false)).toBe(true);
  });

  // The reload issued by the giving-up tick is still in flight when the timer
  // is cleared, so this is the ordinary way the subscription turns up late.
  it("clears when the subscription arrives after the poll gave up", () => {
    expect(showSubscriptionRefreshTimeout(true, true)).toBe(false);
  });

  it("stays hidden for a subscription that never timed out", () => {
    expect(showSubscriptionRefreshTimeout(false, true)).toBe(false);
  });
});

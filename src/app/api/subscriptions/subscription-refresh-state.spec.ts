import { describe, it, expect } from "vitest";
import { showSubscriptionRefreshTimeout } from "./subscription-refresh-state";

describe("showSubscriptionRefreshTimeout", () => {
  it("is hidden before the poll gives up", () => {
    expect(showSubscriptionRefreshTimeout(null, "org-a", false)).toBe(false);
  });

  it("shows once the poll gives up with nothing loaded", () => {
    expect(showSubscriptionRefreshTimeout("org-a", "org-a", false)).toBe(true);
  });

  it("clears when the subscription arrives after the poll gave up", () => {
    expect(showSubscriptionRefreshTimeout("org-a", "org-a", true)).toBe(false);
  });

  it("stays hidden for another org without a subscription", () => {
    expect(showSubscriptionRefreshTimeout("org-a", "org-b", false)).toBe(false);
  });
});

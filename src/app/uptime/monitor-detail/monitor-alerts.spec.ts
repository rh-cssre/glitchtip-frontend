import { describe, it, expect } from "vitest";
import { alertsForMonitor } from "./monitor-alerts";

// One case per branch of the backend rule in send_monitor_notification, so a
// change on either side shows up here.
describe("alertsForMonitor", () => {
  const eventOnly = { id: 1, uptime: false, environments: [] };
  const anyEnvironment = { id: 2, uptime: true, environments: [] };
  const production = { id: 3, uptime: true, environments: ["production"] };
  const staging = { id: 4, uptime: true, environments: ["staging"] };
  const alerts = [eventOnly, anyEnvironment, production, staging];

  const ids = (environment: string | null) =>
    alertsForMonitor(alerts, environment).map((alert) => alert.id);

  it("skips alerts without the uptime trigger", () => {
    expect(ids("production")).not.toContain(1);
  });

  it("matches alerts with no environments for any monitor", () => {
    expect(ids("production")).toContain(2);
    expect(ids(null)).toContain(2);
  });

  it("matches an environment-limited alert only in its environments", () => {
    expect(ids("production")).toEqual([2, 3]);
    expect(ids("staging")).toEqual([2, 4]);
  });

  it("matches only alerts with no environments when the monitor has none", () => {
    expect(ids(null)).toEqual([2]);
  });

  it("treats a missing environments field as all environments", () => {
    expect(alertsForMonitor([{ uptime: true }], "production")).toHaveLength(1);
  });
});

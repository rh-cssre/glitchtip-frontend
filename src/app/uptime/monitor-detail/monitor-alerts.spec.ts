import { describe, it, expect } from "vitest";
import { alertsForMonitor, monitorEnvironmentName } from "./monitor-alerts";

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

describe("monitorEnvironmentName", () => {
  // The environments request uses visibility "all", so hidden ones are here.
  const environments = [
    { id: 1, name: "production" },
    { id: 2, name: "hidden-staging" },
  ];

  it("maps the monitor's environment id to its name", () => {
    expect(monitorEnvironmentName(1, environments)).toBe("production");
  });

  it("finds a hidden environment, which still triggers alerts", () => {
    expect(monitorEnvironmentName(2, environments)).toBe("hidden-staging");
    expect(
      alertsForMonitor(
        [{ uptime: true, environments: ["hidden-staging"] }],
        monitorEnvironmentName(2, environments) ?? null,
      ),
    ).toHaveLength(1);
  });

  it("is null when the monitor has no environment, even if the lookup failed", () => {
    expect(monitorEnvironmentName(null, environments)).toBeNull();
    expect(monitorEnvironmentName(null, undefined)).toBeNull();
  });

  it("is unknown while the environments are loading or failed to load", () => {
    expect(monitorEnvironmentName(1, undefined)).toBeUndefined();
  });

  it("is null when the id matches no environment", () => {
    expect(monitorEnvironmentName(99, environments)).toBeNull();
  });
});

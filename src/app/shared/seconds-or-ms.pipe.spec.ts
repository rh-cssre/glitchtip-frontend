import { describe, expect, it } from "vitest";
import { durationParts } from "./seconds-or-ms.pipe";

describe("durationParts", () => {
  it("keeps short durations in whole milliseconds", () => {
    expect(durationParts(130.4)).toEqual({ value: "130", unit: "ms" });
  });

  it("switches to seconds above 999ms", () => {
    expect(durationParts(1920)).toEqual({ value: "1.92", unit: "s" });
  });

  it("reads a timedelta string", () => {
    expect(durationParts("00:00:02.5")).toEqual({ value: "2.50", unit: "s" });
  });
});

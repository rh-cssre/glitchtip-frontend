import { describe, expect, it } from "vitest";
import { ShortDurationPipe } from "./seconds-or-ms.pipe";

describe("ShortDurationPipe", () => {
  const pipe = new ShortDurationPipe();

  it("rounds milliseconds under a second", () => {
    expect(pipe.transform(814.73)).toBe("815ms");
  });

  it("shows seconds from the point milliseconds would round to 1000", () => {
    expect(pipe.transform(999.6)).toBe("1.00s");
    expect(pipe.transform(1600)).toBe("1.60s");
  });

  it("reads a timedelta string", () => {
    expect(pipe.transform("00:00:01.5")).toBe("1.50s");
  });

  it("shows nothing for an invalid timedelta", () => {
    expect(pipe.transform("soon")).toBe("");
  });
});

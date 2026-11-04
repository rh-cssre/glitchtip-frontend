import { describe, expect, it } from "vitest";
import { TestBed } from "@angular/core/testing";
import { CompactNumberPipe } from "./compact-number.pipe";

describe("CompactNumberPipe", () => {
  const pipe = () =>
    TestBed.runInInjectionContext(() => new CompactNumberPipe());

  it("leaves numbers under 1000 as they are", () => {
    expect(pipe().transform(999)).toBe("999");
  });

  it("shortens larger numbers to one decimal", () => {
    expect(pipe().transform(12345)).toBe("12.3K");
    expect(pipe().transform("2500000")).toBe("2.5M");
  });
});

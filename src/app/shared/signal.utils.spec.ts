import { describe, it, expect } from "vitest";
import { signal } from "@angular/core";
import { keepPreviousValue } from "./signal.utils";

/**
 * A resource in its error state throws from `.value()`, which callers pass in
 * as `source`. Unguarded, that throw froze list views behind a spinner with no
 * way out but a reload, so the swallow behaviour is worth pinning down.
 */
describe("keepPreviousValue", () => {
  it("passes a value straight through", () => {
    const source = signal<string | undefined>("a");
    const kept = keepPreviousValue(source);

    expect(kept()).toBe("a");
  });

  it("keeps the previous value while the source is undefined", () => {
    const source = signal<string | undefined>("a");
    const kept = keepPreviousValue(source);
    expect(kept()).toBe("a");

    source.set(undefined);

    expect(kept()).toBe("a");
  });

  it("does not rethrow when the source throws, keeping the last value", () => {
    const shouldThrow = signal(false);
    const value = signal<string | undefined>("a");
    const kept = keepPreviousValue(() => {
      if (shouldThrow()) {
        throw new Error("Resource is currently in an error state");
      }
      return value();
    });
    expect(kept()).toBe("a");

    shouldThrow.set(true);

    expect(() => kept()).not.toThrow();
    expect(kept()).toBe("a");
  });

  it("stays undefined when the source throws before any value arrives", () => {
    const kept = keepPreviousValue<string>(() => {
      throw new Error("Resource is currently in an error state");
    });

    expect(() => kept()).not.toThrow();
    expect(kept()).toBeUndefined();
  });

  it("recovers once the source stops throwing", () => {
    const shouldThrow = signal(true);
    const kept = keepPreviousValue(() => {
      if (shouldThrow()) {
        throw new Error("Resource is currently in an error state");
      }
      return "fresh";
    });
    expect(kept()).toBeUndefined();

    shouldThrow.set(false);

    expect(kept()).toBe("fresh");
  });
});

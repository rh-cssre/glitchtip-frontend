import { describe, expect, it } from "vitest";
import { limitConcurrency } from "./async.utils";

describe("limitConcurrency", () => {
  it("never runs more than the limit at once, and runs every task", async () => {
    const run = limitConcurrency(2);
    let active = 0;
    let peak = 0;
    const task = async (n: number) => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((done) => setTimeout(done, 5));
      active--;
      return n;
    };
    const results = await Promise.all(
      [1, 2, 3, 4, 5].map((n) => run(() => task(n))),
    );
    expect(results).toEqual([1, 2, 3, 4, 5]);
    expect(peak).toBe(2);
  });

  it("frees a slot when a task fails", async () => {
    const run = limitConcurrency(1);
    await expect(run(() => Promise.reject(new Error("x")))).rejects.toThrow(
      "x",
    );
    await expect(run(async () => "next")).resolves.toBe("next");
  });
});

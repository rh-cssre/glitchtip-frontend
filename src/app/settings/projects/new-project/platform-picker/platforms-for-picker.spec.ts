import { describe, it, expect } from "vitest";
import { filterPlatforms, flattenedPlatforms } from "./platforms-for-picker";

const sorted = [...flattenedPlatforms].sort((a, b) =>
  a.name.localeCompare(b.name),
);
const names = (query: string) =>
  filterPlatforms(sorted, query).map((platform) => platform.name);

describe("filterPlatforms", () => {
  it("returns every platform for an empty query", () => {
    expect(filterPlatforms(sorted, "  ")).toEqual(sorted);
  });

  it("matches names, not ids", () => {
    const results = names("c");
    expect(results[0]).toBe("C#");
    expect(results).toContain("Objective-C");
    expect(results).not.toContain("Vue");
    expect(results).not.toContain("Electron");
  });

  it("ignores punctuation", () => {
    expect(names("c#")[0]).toBe("C#");
    expect(names("nextjs")).toEqual(["Next.js"]);
  });

  it("ranks the name match before its language's frameworks", () => {
    const results = names("python");
    expect(results[0]).toBe("Python");
    expect(results).toContain("Django");
  });
});

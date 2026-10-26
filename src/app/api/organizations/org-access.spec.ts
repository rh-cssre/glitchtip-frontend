import { describe, it, expect } from "vitest";
import { scopesFor, type Scope } from "./org-access";

const access: Scope[] = ["org:read", "project:write", "team:write"];
const org = { slug: "orgA", access };

describe("scopesFor", () => {
  it("returns the org's scopes when it is the selected org", () => {
    expect(scopesFor(org, "orgA")).toEqual(new Set(access));
  });

  it("returns none while the first-org fallback is loaded", () => {
    expect(scopesFor(org, "orgB").size).toBe(0);
  });

  it("returns none before the route selects an org", () => {
    expect(scopesFor(org, null).size).toBe(0);
  });

  it("returns none while the org is loading or failed to load", () => {
    expect(scopesFor(undefined, "orgA").size).toBe(0);
  });

  it("compares slugs case-sensitively", () => {
    expect(scopesFor(org, "orga").size).toBe(0);
  });
});

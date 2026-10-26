import { describe, it, expect } from "vitest";
import { isServerRenderedUrl } from "./server-routes";

/**
 * This predicate decides whether a post-login `next` URL gets a full page load
 * or an in-app router navigation. Getting it wrong is silent: the router has no
 * route for Django-rendered paths, so `navigateByUrl` falls through to the
 * `:org-slug/:project-slug` or `**` route and drops the query string without
 * error. The OAuth consent page carries its entire payload in `?data=`, so that
 * drop is what breaks the MCP connect flow.
 */
describe("isServerRenderedUrl", () => {
  it("claims the Django-rendered prefixes", () => {
    expect(isServerRenderedUrl("/admin/")).toBe(true);
    expect(isServerRenderedUrl("/oauth/authorize/")).toBe(true);
  });

  it("keeps the query string case working, which is the whole point", () => {
    expect(isServerRenderedUrl("/oauth/authorize/?data=abc.def.ghi")).toBe(
      true,
    );
  });

  it("leaves SPA routes to the router", () => {
    expect(isServerRenderedUrl("/")).toBe(false);
    expect(isServerRenderedUrl("/my-org/issues")).toBe(false);
    expect(isServerRenderedUrl("/profile")).toBe(false);
    expect(isServerRenderedUrl("/organizations/new")).toBe(false);
  });

  it("does not claim /accept/, which the SPA regex matches before Django", () => {
    expect(isServerRenderedUrl("/accept/abc/def/")).toBe(false);
  });

  it("does not claim /accounts/, which is headless-only on the backend", () => {
    expect(isServerRenderedUrl("/accounts/social/login/")).toBe(false);
  });

  it("stays as narrow as the routes Django actually serves", () => {
    // Only /oauth/authorize/ exists; the rest of /oauth/ 404s, so it should
    // not earn a full page load.
    expect(isServerRenderedUrl("/oauth/")).toBe(false);
    expect(isServerRenderedUrl("/oauth/token")).toBe(false);
  });

  it("rejects anything that is not a path-absolute reference", () => {
    // These are authorities or schemes, not paths. The prefix list would also
    // reject them today, so these cases pin the origin check itself: they must
    // keep failing even if the prefix list is edited.
    expect(isServerRenderedUrl("//evil.test/admin/")).toBe(false);
    expect(isServerRenderedUrl("/\\evil.test/admin/")).toBe(false);
    expect(isServerRenderedUrl("\\\\evil.test/admin/")).toBe(false);
    expect(isServerRenderedUrl("https://evil.test/admin/")).toBe(false);
    expect(isServerRenderedUrl("javascript:alert(1)")).toBe(false);
    expect(isServerRenderedUrl("admin/")).toBe(false);
    expect(isServerRenderedUrl("")).toBe(false);
  });

  it("does not match a prefix that merely appears later in the path", () => {
    expect(isServerRenderedUrl("/my-org/oauth/authorize/")).toBe(false);
  });
});

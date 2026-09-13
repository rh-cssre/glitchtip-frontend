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
    expect(isServerRenderedUrl("/accounts/social/login/")).toBe(true);
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

  it("refuses to send a full page load off-origin", () => {
    // A protocol-relative URL is a host, not a path: `//evil.test/admin/` would
    // otherwise be handed to window.location.href.
    expect(isServerRenderedUrl("//evil.test/admin/")).toBe(false);
    expect(isServerRenderedUrl("https://evil.test/admin/")).toBe(false);
    expect(isServerRenderedUrl("admin/")).toBe(false);
  });

  it("does not match a prefix that merely appears later in the path", () => {
    expect(isServerRenderedUrl("/my-org/oauth/authorize/")).toBe(false);
  });
});

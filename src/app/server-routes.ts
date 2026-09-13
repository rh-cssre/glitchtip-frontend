/**
 * Paths that Django renders, which the Angular router must not claim.
 *
 * The router has no route for these, so a `navigateByUrl` to one is swallowed
 * by `:org-slug/:project-slug` or the `**` wildcard and the query string is
 * discarded. That breaks any handoff whose payload lives in the query string —
 * notably the MCP OAuth consent page, which is reached as
 * `/oauth/authorize/?data=<signed>` and rejects the request outright when
 * `data` is missing.
 *
 * These must be reached with a full page load instead.
 */
const SERVER_RENDERED_PREFIXES = ["/admin/", "/oauth/", "/accounts/"];

/**
 * True when `url` is served by Django and so needs a real browser navigation.
 *
 * Protocol-relative URLs are rejected so this can never green-light a
 * full-page navigation to another origin.
 */
export function isServerRenderedUrl(url: string): boolean {
  if (!url.startsWith("/") || url.startsWith("//")) {
    return false;
  }
  return SERVER_RENDERED_PREFIXES.some((prefix) => url.startsWith(prefix));
}

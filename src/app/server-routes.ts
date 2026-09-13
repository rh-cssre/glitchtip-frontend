/**
 * Paths that Django renders, which the Angular router must not claim.
 *
 * The router has no route for these, so a `navigateByUrl` to one is swallowed
 * by `:org-slug/:project-slug` or the `**` wildcard and the query string is
 * discarded. That breaks any handoff whose payload lives in the query string —
 * notably the OAuth consent page, which is reached as
 * `/oauth/authorize/?data=<signed>` and rejects the request outright when
 * `data` is missing.
 *
 * These must be reached with a full page load instead.
 *
 * Keep the list exactly as narrow as what the backend actually serves. The
 * source of truth is the SPA `re_path` in the backend's `glitchtip/urls.py`:
 * whatever that regex does not claim, Django keeps. Note `/accounts/` does
 * *not* belong here — the backend runs allauth with `HEADLESS_ONLY`, so
 * everything under it is a JSON endpoint or a 404, never a page to land on.
 */
const SERVER_RENDERED_PREFIXES = ["/admin/", "/oauth/authorize/"];

/** A path-absolute reference: one leading slash, and no authority after it. */
const PATH_ABSOLUTE = /^\/[^/\\]/;

/**
 * True when `url` is served by Django and so needs a real browser navigation.
 *
 * `url` is attacker-influenceable — it arrives as the `next` query parameter,
 * and a true result hands it to `window.location.href`, which *can* leave the
 * origin. So require a path-absolute reference before matching at all:
 * `//evil.test` and `/\evil.test` are authorities rather than paths (browsers
 * fold `\` into `/` in that position), and a scheme like `javascript:` has no
 * leading slash to begin with.
 *
 * The prefixes above happen to reject those too, but only by accident of their
 * spelling. This check holds the origin boundary on its own, so editing the
 * list cannot quietly open one.
 */
export function isServerRenderedUrl(url: string): boolean {
  if (!PATH_ABSOLUTE.test(url)) {
    return false;
  }
  return SERVER_RENDERED_PREFIXES.some((prefix) => url.startsWith(prefix));
}

/**
 * Curated lists of the design tokens surfaced on the Foundations pages.
 *
 * `getComputedStyle` can read a custom property's value but cannot *enumerate*
 * which custom properties exist, so the token *names* are authored here (the
 * single source of truth for "what's in the system") while their *values* are
 * read live from the DOM via `resolveCssVar`. That keeps the reference honest:
 * if a token's value changes in the app theme, this page reflects it with no
 * edit here; only adding/removing a token needs a change to these lists.
 */

/** A single design token to display: its CSS custom-property name and a label. */
export interface TokenDef {
  /** CSS custom property, including the leading `--`. */
  readonly name: string;
  /** Short human label shown alongside the token. */
  readonly label?: string;
}

/** A named group of tokens, rendered as one section on a Foundations page. */
export interface TokenGroup {
  readonly group: string;
  readonly note?: string;
  readonly tokens: TokenDef[];
}

/** A background/foreground pairing, used to preview text contrast on a color. */
export interface ColorPair {
  readonly label: string;
  readonly bg: string;
  readonly on: string;
}

/**
 * Material 3 system color tokens plus the app's custom extended colors
 * (defined at :root in `src/styles.scss`). Grouped by role.
 */
export const COLOR_TOKENS: TokenGroup[] = [
  {
    group: "Primary & accents",
    note: "Primary drives key actions and selected states. Each role pairs with its on- token for text/icons drawn on top.",
    tokens: [
      { name: "--mat-sys-primary" },
      { name: "--mat-sys-on-primary" },
      { name: "--mat-sys-primary-container" },
      { name: "--mat-sys-on-primary-container" },
      { name: "--mat-sys-secondary" },
      { name: "--mat-sys-on-secondary" },
      { name: "--mat-sys-tertiary" },
      { name: "--mat-sys-on-tertiary" },
      { name: "--mat-sys-inverse-primary" },
    ],
  },
  {
    group: "Surfaces & background",
    note: "Use surface containers to layer UI: higher containers sit on top of lower ones. Body text uses on-surface; secondary text uses on-surface-variant.",
    tokens: [
      { name: "--mat-sys-background" },
      { name: "--mat-sys-on-background" },
      { name: "--mat-sys-surface" },
      { name: "--mat-sys-on-surface" },
      { name: "--mat-sys-on-surface-variant" },
      { name: "--mat-sys-surface-variant" },
      { name: "--mat-sys-surface-container-low" },
      { name: "--mat-sys-surface-container" },
      { name: "--mat-sys-surface-container-high" },
      { name: "--mat-sys-surface-container-highest" },
    ],
  },
  {
    group: "Semantic & outline",
    note: "Error signals destructive or failed states. Outline is for borders and dividers; outline-variant is the subtler divider.",
    tokens: [
      { name: "--mat-sys-error" },
      { name: "--mat-sys-on-error" },
      { name: "--mat-sys-outline" },
      { name: "--mat-sys-outline-variant" },
    ],
  },
  {
    group: "Extended (app-specific)",
    note: "Custom roles layered on top of Material 3, defined at :root in src/styles.scss.",
    tokens: [
      { name: "--warning-color" },
      { name: "--warning-container" },
      { name: "--on-warning" },
      { name: "--info-color" },
      { name: "--info-container" },
      { name: "--on-info" },
      { name: "--success-color" },
      { name: "--success-container" },
      { name: "--on-success" },
      { name: "--issues-color", label: "Issues" },
      { name: "--uptime-color", label: "Uptime" },
      { name: "--logs-color", label: "Logs" },
    ],
  },
];

/**
 * Background/on-color pairings for the contrast strip. Each renders the `on`
 * token as text on the `bg` token so mismatches are obvious at a glance.
 */
export const ON_COLOR_PAIRS: ColorPair[] = [
  { label: "Primary", bg: "--mat-sys-primary", on: "--mat-sys-on-primary" },
  {
    label: "Primary container",
    bg: "--mat-sys-primary-container",
    on: "--mat-sys-on-primary-container",
  },
  { label: "Surface", bg: "--mat-sys-surface", on: "--mat-sys-on-surface" },
  {
    label: "Surface container high",
    bg: "--mat-sys-surface-container-high",
    on: "--mat-sys-on-surface",
  },
  { label: "Error", bg: "--mat-sys-error", on: "--mat-sys-on-error" },
];

/**
 * Material 3 typography tokens. Each resolves to a full `font` shorthand, so
 * applying it as `font: var(--name)` reproduces the exact type style.
 */
export const TYPE_TOKENS: TokenDef[] = [
  { name: "--mat-sys-headline-small", label: "Headline small" },
  { name: "--mat-sys-title-large", label: "Title large" },
  { name: "--mat-sys-title-medium", label: "Title medium" },
  { name: "--mat-sys-title-small", label: "Title small" },
  { name: "--mat-sys-body-large", label: "Body large" },
  { name: "--mat-sys-body-medium", label: "Body medium" },
  { name: "--mat-sys-body-small", label: "Body small" },
  { name: "--mat-sys-label-large", label: "Label large" },
  { name: "--mat-sys-label-medium", label: "Label medium" },
];

/**
 * The app's custom text classes (defined in `_font-files.scss`), which layer
 * semantic intent on top of the raw Material type tokens.
 */
export const CUSTOM_TYPE_CLASSES: { className: string; usage: string }[] = [
  { className: "section-header-text", usage: "Page titles" },
  { className: "section-header-text-light", usage: "Issue titles (lighter weight)" },
  { className: "body-text", usage: "Longer text blocks" },
  { className: "body-text-strong", usage: "Emphasized body text" },
  { className: "caption-text", usage: "Small / secondary text" },
];

/**
 * The additive spacing scale (8px base grid) defined at :root in
 * `src/styles.scss`. Migrating existing ad-hoc px usage onto these is roadmap.
 */
export const SPACE_TOKENS: TokenDef[] = [
  { name: "--gt-space-0" },
  { name: "--gt-space-1" },
  { name: "--gt-space-2" },
  { name: "--gt-space-3" },
  { name: "--gt-space-4" },
  { name: "--gt-space-5" },
  { name: "--gt-space-6" },
  { name: "--gt-space-7" },
];

/** Material 3 elevation level tokens, probed (empties are hidden by the page). */
export const ELEVATION_TOKENS: TokenDef[] = [
  { name: "--mat-sys-level0", label: "Level 0" },
  { name: "--mat-sys-level1", label: "Level 1" },
  { name: "--mat-sys-level2", label: "Level 2" },
  { name: "--mat-sys-level3", label: "Level 3" },
  { name: "--mat-sys-level4", label: "Level 4" },
  { name: "--mat-sys-level5", label: "Level 5" },
];

/**
 * Reads a CSS custom property's *declared* value from the given element's
 * computed style. Good for non-color tokens (type shorthands, spacing) whose
 * declaration is already the final value. Resolving against an element inside
 * the preview canvas matters: the canvas sets `color-scheme`.
 *
 * Note: for color tokens declared with `light-dark(...)`, this returns the raw
 * expression, not the scheme-resolved color — use `resolveComputedColor` for
 * those.
 */
export function resolveCssVar(name: string, el: Element): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/**
 * Resolves a color token to the actual color painted in the current scheme.
 * `getComputedStyle` on a custom property returns its declaration (e.g. the
 * `light-dark(...)` expression), so instead we paint the token onto a throwaway
 * probe element inside the canvas subtree and read back the computed `color`,
 * which the browser resolves for the canvas' `color-scheme`. Returned as a hex
 * string for a compact, familiar display.
 */
export function resolveComputedColor(name: string, hostEl: Element): string {
  const doc = hostEl.ownerDocument;
  const probe = doc.createElement("span");
  probe.style.cssText = "position:absolute;left:-9999px;width:0;height:0;";
  probe.style.color = `var(${name})`;
  hostEl.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  hostEl.removeChild(probe);
  return rgbToHex(computed);
}

/** Converts an `rgb()`/`rgba()` string to `#rrggbb` (keeping alpha if < 1). */
function rgbToHex(color: string): string {
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) return color;
  const parts = match[1].split(",").map((p) => p.trim());
  const toHex = (v: string) =>
    Math.round(parseFloat(v)).toString(16).padStart(2, "0");
  const hex = `#${toHex(parts[0])}${toHex(parts[1])}${toHex(parts[2])}`;
  if (parts.length === 4 && parseFloat(parts[3]) < 1) {
    return `${hex} / ${parts[3]}`;
  }
  return hex;
}

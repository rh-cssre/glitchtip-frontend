/**
 * Every token scope in API order. Each name is one message, so translators
 * can reorder resource and level.
 */
const TOKEN_SCOPE_LABELS: Record<string, string> = {
  "project:read": $localize`Projects: read`,
  "project:write": $localize`Projects: write`,
  "project:admin": $localize`Projects: admin`,
  "project:releases": $localize`Projects: releases`,
  "team:read": $localize`Teams: read`,
  "team:write": $localize`Teams: write`,
  "team:admin": $localize`Teams: admin`,
  "event:read": $localize`Events: read`,
  "event:write": $localize`Events: write`,
  "event:admin": $localize`Events: admin`,
  "org:read": $localize`Organization: read`,
  "org:write": $localize`Organization: write`,
  "org:admin": $localize`Organization: admin`,
  "member:read": $localize`Members: read`,
  "member:write": $localize`Members: write`,
  "member:admin": $localize`Members: admin`,
};

export const TOKEN_SCOPES = Object.keys(TOKEN_SCOPE_LABELS);

/** The columns of the scope grid. */
export const TOKEN_SCOPE_LEVELS = [
  { key: "read", name: $localize`read` },
  { key: "write", name: $localize`write` },
  { key: "admin", name: $localize`admin` },
  { key: "releases", name: $localize`releases` },
];

/**
 * The scopes as a grid: one row per resource, one cell per level holding the
 * scope's form index, or null when the resource lacks that level.
 */
export const TOKEN_SCOPE_GROUPS = [
  { resource: $localize`Projects`, prefix: "project" },
  { resource: $localize`Teams`, prefix: "team" },
  { resource: $localize`Events`, prefix: "event" },
  { resource: $localize`Organization`, prefix: "org" },
  { resource: $localize`Members`, prefix: "member" },
].map(({ resource, prefix }) => ({
  resource,
  prefix,
  cells: TOKEN_SCOPE_LEVELS.map(({ key }) => {
    const scope = `${prefix}:${key}`;
    const index = TOKEN_SCOPES.indexOf(scope);
    return index === -1 ? null : { index, label: TOKEN_SCOPE_LABELS[scope] };
  }),
}));

/** "Full access", or the token's scopes as a short list. */
export function scopesLabel(scopes: string[] | null | undefined) {
  if (!scopes?.length) return "";
  if (TOKEN_SCOPES.every((scope) => scopes.includes(scope))) {
    return $localize`Full access`;
  }
  return scopes.join(", ");
}

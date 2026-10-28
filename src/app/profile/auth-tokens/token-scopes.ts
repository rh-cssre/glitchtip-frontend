/** Every scope an auth token can have, in the order the API lists them. */
export const TOKEN_SCOPES = [
  "project:read",
  "project:write",
  "project:admin",
  "project:releases",
  "team:read",
  "team:write",
  "team:admin",
  "event:read",
  "event:write",
  "event:admin",
  "org:read",
  "org:write",
  "org:admin",
  "member:read",
  "member:write",
  "member:admin",
];

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
  cells: TOKEN_SCOPE_LEVELS.map(({ key, name }) => {
    const index = TOKEN_SCOPES.indexOf(`${prefix}:${key}`);
    return index === -1
      ? null
      : { index, label: $localize`${resource}:resource:, ${name}:level:` };
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

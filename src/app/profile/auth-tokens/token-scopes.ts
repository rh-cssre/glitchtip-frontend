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

/** The scopes as a grid: one row per resource, one column per level. */
export const TOKEN_SCOPE_GROUPS = [
  { resource: $localize`Projects`, prefix: "project" },
  { resource: $localize`Teams`, prefix: "team" },
  { resource: $localize`Events`, prefix: "event" },
  { resource: $localize`Organization`, prefix: "org" },
  { resource: $localize`Members`, prefix: "member" },
].map((group) => ({
  ...group,
  scopes: TOKEN_SCOPES.flatMap((scope, index) =>
    scope.startsWith(group.prefix + ":")
      ? [{ index, level: scope.split(":")[1] }]
      : [],
  ),
}));

/** "Full access", or the token's scopes as a short list. */
export function scopesLabel(scopes: string[] | null | undefined) {
  if (!scopes?.length) return "";
  if (TOKEN_SCOPES.every((scope) => scopes.includes(scope))) {
    return $localize`Full access`;
  }
  return scopes.join(", ");
}

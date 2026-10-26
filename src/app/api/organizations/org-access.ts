import type { components } from "../api-schema";

type OrganizationDetail = components["schemas"]["OrganizationDetailSchema"];
export type Scope = OrganizationDetail["access"][number];

/**
 * The user's scopes in `org`, or none when `org` isn't the selected org. While
 * switching orgs, or before the route sets one, the loaded org is the
 * first-org fallback, and its scopes say nothing about the org being viewed.
 */
export function scopesFor(
  org: Pick<OrganizationDetail, "slug" | "access"> | undefined,
  selectedSlug: string | null,
): ReadonlySet<Scope> {
  return new Set(org && org.slug === selectedSlug ? org.access : []);
}

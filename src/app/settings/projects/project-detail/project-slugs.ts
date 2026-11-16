export interface ProjectSlugs {
  orgSlug: string;
  projectSlug: string;
}

// Setting the same project again must not refetch.
export const sameProjectSlugs = (
  a: ProjectSlugs | null,
  b: ProjectSlugs | null,
) => a?.orgSlug === b?.orgSlug && a?.projectSlug === b?.projectSlug;

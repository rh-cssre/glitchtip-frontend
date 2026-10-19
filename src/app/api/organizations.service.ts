import { computed, inject, Injectable, signal, untracked } from "@angular/core";
import { client } from "../shared/api/api";
import { AuthService } from "../auth.service";
import { apiResource } from "../shared/api/api-resource-factory";

@Injectable({
  providedIn: "root",
})
export class OrganizationsService {
  authService = inject(AuthService);

  #activeOrganizationSlug = signal<string | null>(null);
  activeOrganizationSlug = computed(
    () =>
      this.#activeOrganizationSlug() ?? this.organizations()?.[0]?.slug ?? null,
  );
  /**
   * The org slug explicitly set from the route / org switcher, WITHOUT the
   * "default to the first org" fallback that activeOrganizationSlug applies. Use
   * this to key data fetches that must target the org the user is actually
   * viewing: keying on the fallback can fetch the first org's data during the
   * brief window before the route resolves (wrong-org fetch / "loads both orgs").
   */
  readonly selectedOrganizationSlug = this.#activeOrganizationSlug.asReadonly();
  organizationsResource = apiResource.fetchAll(
    this.authService.isAuthenticated,
    () => ({
      url: "/api/0/organizations/",
    }),
  );

  activeOrganizationResource = apiResource(
    this.activeOrganizationSlug,
    (slug) => ({
      url: "/api/0/organizations/{organization_id_or_slug}/",
      options: {
        params: {
          path: this.orgPath(slug),
        },
      },
    }),
  );
  organizations = computed(() => {
    if (this.organizationsResource.error()) return [];
    return this.organizationsResource.value() || [];
  });
  #orgIdsBySlug = computed(
    () => new Map(this.organizations().map((org) => [org.slug, org.id])),
  );
  organizationsCount = computed(() => this.organizations().length);
  activeOrganization = computed(() => {
    if (this.activeOrganizationResource.error()) return undefined;
    return this.activeOrganizationResource.value();
  });
  organizationsLoaded = computed(
    () =>
      this.organizationsResource.hasValue() ||
      !this.organizationsResource.isLoading(),
  );
  activeOrganizationLoaded = computed(
    () =>
      this.activeOrganizationResource.hasValue() ||
      !this.activeOrganizationResource.isLoading(),
  );
  activeOrganizationProjects = computed(
    () => this.activeOrganization()?.projects || [],
  );
  projectsCount = computed(() => this.activeOrganizationProjects().length);
  initialLoad = computed(
    () => this.organizationsLoaded() && this.activeOrganizationLoaded(),
  );
  access = computed(() => this.activeOrganization()?.access || []);
  accessProjectWrite = computed(() => this.access().includes("project:write"));
  accessTeamWrite = computed(
    () =>
      this.access().includes("project:write") ||
      this.access().includes("org:write"),
  );
  accessMemberWrite = computed(
    () =>
      this.access().includes("member:admin") ||
      this.access().includes("member:write"),
  );
  accessOrgAdmin = computed(() => this.access().includes("org:admin"));

  constructor() {
    setTimeout(() => this.refresh(), 30000);
  }

  /**
   * The value for an API path's {organization_id_or_slug}: the org's id, which
   * saves the backend a slug lookup. Falls back to the slug, which the backend
   * also accepts, for an org the org list doesn't have (yet). Reads the list
   * untracked, so a call from a resource's params or a computed doesn't refetch
   * once the list loads. Loaders and plain methods don't track signals anyway.
   */
  orgIdOrSlug(slug: string): string {
    return untracked(this.#orgIdsBySlug).get(slug) ?? slug;
  }

  /**
   * Path params for an org-scoped endpoint. Spread it when the path has more
   * params: `path: { ...orgPath(slug), project_slug }`.
   *
   * Specs that stub this service with `useValue` must include `orgPath` once
   * the code under test makes an org-scoped request; without it the request
   * throws a TypeError from inside the resource.
   * `(slug) => ({ organization_id_or_slug: slug })` is enough.
   */
  orgPath(slug: string): { organization_id_or_slug: string } {
    return { organization_id_or_slug: this.orgIdOrSlug(slug) };
  }

  setActiveOrganizationSlug(slug: string | null) {
    this.#activeOrganizationSlug.set(slug);
  }

  refreshActiveOrganization() {
    return this.activeOrganizationResource.reload();
  }

  reload() {
    this.organizationsResource.reload();
    this.activeOrganizationResource.reload();
  }

  async createOrganization(name: string) {
    const { data, error } = await client.POST("/api/0/organizations/", {
      body: { name },
    });
    if (data) {
      this.organizationsResource.update((orgs) =>
        orgs ? [...orgs, data] : [data],
      );
    }
    return { data, error };
  }

  /**
   * Silently attempt to refresh active org details every 2 seconds
   * until event rate throttle is 0 or 12 seconds passes.
   */
  repeatRefreshOrgDetail(i = 0) {
    this.activeOrganizationResource.reload();
    const org = this.activeOrganization();
    if (
      i < 10 &&
      (org?.eventThrottleRate === undefined || org.eventThrottleRate > 0)
    ) {
      setTimeout(() => this.repeatRefreshOrgDetail(i + 1), 2000);
    }
  }

  private refresh() {
    this.activeOrganizationResource.reload();
    this.organizationsResource.reload();
    setTimeout(() => this.refresh(), 10 * 60 * 1000); // 10 min
  }
}

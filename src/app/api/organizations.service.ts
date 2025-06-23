import { computed, inject, Injectable, signal } from "@angular/core";
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
  organizationsResource = apiResource.fetchAll(
    this.authService.isAuthenticated,
    () => ({
      url: "/api/0/organizations/",
    }),
  );

  activeOrganizationResource = apiResource(
    this.activeOrganizationSlug,
    (slug) => ({
      url: "/api/0/organizations/{organization_slug}/",
      options: {
        params: {
          path: { organization_slug: slug },
        },
      },
    }),
  );
  organizations = computed(() => this.organizationsResource.value() || []);
  organizationsCount = computed(() => this.organizations.length);
  activeOrganization = computed(() => this.activeOrganizationResource.value());
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

  constructor() {
    setTimeout(() => this.refresh(), 30000);
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

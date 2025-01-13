import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { client } from "./api";
import { toObservable } from "@angular/core/rxjs-interop";
import { interval, takeUntil, takeWhile } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: "root",
})
export class OrganizationsService {
  authService = inject(AuthService);

  #activeOrganizationSlug = signal<string | null>(null);
  activeOrganizationSlug = computed(
    () =>
      this.#activeOrganizationSlug() ?? this.organizations()?.[0]?.slug ?? null
  );
  organizationsResource = resource({
    request: () => ({ isAuthenticated: this.authService.isAuthenticated() }),
    loader: async ({ request }) => {
      if (!request.isAuthenticated) {
        return undefined;
      }
      const { data } = await client.GET("/api/0/organizations/");
      return data;
    },
  });
  activeOrganizationResource = resource({
    request: () => ({ organization_slug: this.activeOrganizationSlug() }),
    loader: async ({ request }) => {
      if (!request.organization_slug) {
        return undefined;
      }
      const { data, error } = await client.GET(
        "/api/0/organizations/{organization_slug}/",
        {
          params: {
            path: { organization_slug: request.organization_slug },
          },
        }
      );
      if (error) {
        throw error;
      }
      return data;
    },
  });
  organizations = computed(() => this.organizationsResource.value() || []);
  organizationsCount = computed(() => this.organizations.length);
  activeOrganization = computed(() => this.activeOrganizationResource.value());
  activeOrganizationLoaded = computed(() =>
    this.activeOrganizationResource.hasValue()
  );
  activeOrganizationProjects = computed(
    () => this.activeOrganization()?.projects || []
  );
  projectsCount = computed(() => this.activeOrganizationProjects().length);
  initialLoad = computed(
    () =>
      this.organizationsResource.hasValue() && this.activeOrganizationLoaded()
  );

  // For compatibility, remove when possible
  activeOrganization$ = toObservable(this.activeOrganization);
  activeOrganizationSlug$ = toObservable(this.activeOrganizationSlug);
  activeOrganizationProjects$ = toObservable(this.activeOrganizationProjects);

  setActiveOrganizationSlug(slug: string | null) {
    this.#activeOrganizationSlug.set(slug);
  }

  refreshActiveOrganization() {
    return this.activeOrganizationResource.reload();
  }

  async createOrganization(name: string) {
    const { data, error } = await client.POST("/api/0/organizations/", {
      body: { name },
    });
    if (data) {
      this.organizationsResource.update((orgs) =>
        orgs ? [...orgs, data] : [data]
      );
    }
    return { data, error };
  }

  /**
   * Silently attempt to refresh active org details every 2 seconds
   * until event rate throttle is 0 or 12 seconds passes.
   */
  repeatRefreshOrgDetail() {
    this.activeOrganizationResource.reload();
    this.activeOrganization$
      .pipe(
        takeUntil(interval(2000).pipe(takeUntil(interval(12000)))),
        takeWhile(
          (org) =>
            org?.eventThrottleRate === undefined || org.eventThrottleRate > 0
        )
      )
      .subscribe(() => this.activeOrganizationResource.reload());
  }
}

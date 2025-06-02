import {
  computed,
  inject,
  Injectable,
  resource,
  ResourceStatus,
  signal,
} from "@angular/core";
import { client } from "./api";
import { toObservable } from "@angular/core/rxjs-interop";
import { interval, takeUntil, takeWhile } from "rxjs";
import { AuthService } from "../auth.service";
import { refreshInterval } from "../shared/shared.utils";
import { getCursor, updateArrayById } from "../shared/pagination.utils";
import { components } from "./api-schema";

type Organization = components["schemas"]["OrganizationSchema"];

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
  organizationsResource = resource({
    request: () => ({ isAuthenticated: this.authService.isAuthenticated() }),
    loader: async ({ request, abortSignal }) => {
      if (!request.isAuthenticated) {
        return undefined;
      }
      let { data, response } = await client.GET("/api/0/organizations/", {
        signal: abortSignal,
      });
      let cursor = getCursor(response);
      if (!cursor || !data || abortSignal.aborted) {
        return data; // If one page, return early
      }

      // Get existing organizations to persist during reload
      let allAccumulatedOrgs: Organization[] = [
        ...(this.organizationsResource.value() || []),
      ];
      // Update existing organizations and add new ones
      updateArrayById(allAccumulatedOrgs, data);
      // Track all organization IDs from API to identify removed orgs later
      const loadedOrgIds = new Set<string>();
      // Add first page organization IDs
      data?.forEach((org) => loadedOrgIds.add(org.id));

      // Set causes abortSignal.aborted to be true, don't rely on it going forward
      this.organizationsResource.set(allAccumulatedOrgs);
      let i = 0;
      while (cursor && i < 10) {
        i++;
        ({ data, response } = await client.GET("/api/0/organizations/", {
          params: {
            query: {
              cursor,
            },
          },
        }));
        cursor = getCursor(response);
        if (data) {
          // Track organization IDs and update orgs from this page
          data.forEach((org) => loadedOrgIds.add(org.id));
          updateArrayById(allAccumulatedOrgs, data);
          if (cursor) {
            this.organizationsResource.set(allAccumulatedOrgs);
          }
        }
      }

      // Remove organizations that weren't found in any of the API responses
      allAccumulatedOrgs = allAccumulatedOrgs.filter((org) =>
        loadedOrgIds.has(org.id),
      );
      // Final update with removing orgs no longer present
      this.organizationsResource.set(allAccumulatedOrgs);
      return allAccumulatedOrgs;
    },
  });
  activeOrganizationResource = resource({
    request: () => ({ organization_slug: this.activeOrganizationSlug() }),
    loader: async ({ request, abortSignal }) => {
      if (!request.organization_slug) {
        return undefined;
      }
      const { data, error } = await client.GET(
        "/api/0/organizations/{organization_slug}/",
        {
          params: {
            path: { organization_slug: request.organization_slug },
          },
          signal: abortSignal,
        },
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
  activeOrganizationLoaded = computed(
    () => this.activeOrganizationResource.status() >= ResourceStatus.Resolved,
  );
  activeOrganizationProjects = computed(
    () => this.activeOrganization()?.projects || [],
  );
  projectsCount = computed(() => this.activeOrganizationProjects().length);
  initialLoad = computed(
    () =>
      this.organizationsResource.status() > ResourceStatus.Loading &&
      this.activeOrganizationResource.status() > ResourceStatus.Loading,
  );

  // For compatibility, remove when possible
  activeOrganization$ = toObservable(this.activeOrganization);
  activeOrganizationSlug$ = toObservable(this.activeOrganizationSlug);
  activeOrganizationProjects$ = toObservable(this.activeOrganizationProjects);

  constructor() {
    this.refresh();
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
  repeatRefreshOrgDetail() {
    this.activeOrganizationResource.reload();
    this.activeOrganization$
      .pipe(
        takeUntil(interval(2000).pipe(takeUntil(interval(12000)))),
        takeWhile(
          (org) =>
            org?.eventThrottleRate === undefined || org.eventThrottleRate > 0,
        ),
      )
      .subscribe(() => this.activeOrganizationResource.reload());
  }

  private refresh() {
    // Refresh 30s, 10m, 30m...
    refreshInterval([30, 60 * 10], 60 * 30).subscribe(() => this.reload());
  }
}

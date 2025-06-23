import { computed, inject, Injectable, signal } from "@angular/core";
import { OrganizationsService } from "./organizations.service";
import { apiResource } from "../shared/api/api-resource-factory";

@Injectable({
  providedIn: "root",
})
export class EnvironmentsService {
  #orgService = inject(OrganizationsService);

  projectSlug = signal<string | null>(null);
  #orgEnvironmentsResource = apiResource.fetchAll(
    this.#orgService.activeOrganizationSlug,
    (slug) => ({
      url: "/api/0/organizations/{organization_slug}/environments/",
      options: {
        params: {
          path: { organization_slug: slug },
        },
      },
    }),
  );
  #projectEnvironmentsParams = computed(() => {
    const orgSlug = this.#orgService.activeOrganizationSlug();
    const projectSlug = this.projectSlug();
    if (projectSlug) {
      return { orgSlug, projectSlug };
    }
    return;
  });
  #projectEnvironmentsResource = apiResource.fetchAll(
    this.#projectEnvironmentsParams,
    (params) => ({
      url: `/api/0/projects/{organization_slug}/{project_slug}/environments/`,
      options: {
        params: {
          path: {
            organization_slug: params.orgSlug,
            project_slug: params.projectSlug,
          },
        },
      },
    }),
  );
  orgEnvironments = computed(() => this.#orgEnvironmentsResource.value() || []);
  projectEnvironments = computed(
    () => this.#projectEnvironmentsResource.value() || [],
  );
  environments = computed(() =>
    this.projectSlug() ? this.projectEnvironments() : this.orgEnvironments(),
  );
  environmentNames = computed(() => this.environments().map((env) => env.name));

  reload() {
    this.#orgEnvironmentsResource.reload();
    this.#projectEnvironmentsResource.reload();
  }
}

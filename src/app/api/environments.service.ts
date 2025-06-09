import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { OrganizationsService } from "./organizations.service";
import { client } from "./api";
import { getCursor } from "../shared/pagination.utils";

@Injectable({
  providedIn: "root",
})
export class EnvironmentsService {
  #orgService = inject(OrganizationsService);

  projectSlug = signal<string | null>(null);
  #orgEnvironmentsResource = resource({
    params: () => ({
      orgSlug: this.#orgService.activeOrganizationSlug(),
    }),
    loader: async ({ params, abortSignal }) => {
      if (!params.orgSlug) {
        return undefined;
      }
      let { data, response } = await client.GET(
        "/api/0/organizations/{organization_slug}/environments/",
        {
          signal: abortSignal,
          params: {
            path: { organization_slug: params.orgSlug },
            query: { limit: 200 },
          },
        },
      );
      let cursor = getCursor(response);
      const page1 = data;
      if (cursor && page1 && !abortSignal.aborted) {
        // Support up to 400 environments
        ({ data, response } = await client.GET(
          "/api/0/organizations/{organization_slug}/environments/",
          {
            signal: abortSignal,
            params: {
              path: { organization_slug: params.orgSlug },
              query: { limit: 200, cursor },
            },
          },
        ));
        if (data) {
          return page1.concat(data);
        }
      }
      return page1;
    },
  });
  #projectEnvironmentsResource = resource({
    params: () => ({
      orgSlug: this.#orgService.activeOrganizationSlug(),
      projectSlug: this.projectSlug(),
    }),
    loader: async ({ params, abortSignal }) => {
      if (!params.orgSlug || !params.projectSlug) {
        return undefined;
      }
      let { data, response } = await client.GET(
        "/api/0/projects/{organization_slug}/{project_slug}/environments/",
        {
          signal: abortSignal,
          params: {
            path: {
              organization_slug: params.orgSlug,
              project_slug: params.projectSlug,
            },
            query: {
              limit: 200,
            },
          },
        },
      );
      let cursor = getCursor(response);
      const page1 = data;
      if (cursor && page1 && !abortSignal.aborted) {
        // Support up to 400 environments
        ({ data, response } = await client.GET(
          "/api/0/projects/{organization_slug}/{project_slug}/environments/",
          {
            signal: abortSignal,
            params: {
              path: {
                organization_slug: params.orgSlug,
                project_slug: params.projectSlug,
              },
              query: { limit: 200, cursor },
            },
          },
        ));
        if (data) {
          return page1.concat(data);
        }
      }
      return page1;
    },
  });
  // loading = computed(() => this.#orgEnvironmentsResource.isLoading());
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

import { computed, Injectable, resource, signal } from "@angular/core";
import { client, handleError } from "src/app/shared/api/api";
import { getPaginationHeaders } from "src/app/shared/pagination.utils";

@Injectable()
export class SettingsProjectsService {
  orgSlug = signal<string>("");

  private projectsResource = resource({
    params: () => ({ orgSlug: this.orgSlug() }),
    loader: async ({ params }) => {
      if (!params.orgSlug) {
        return undefined;
      }
      const { data, error, response } = await client.GET(
        "/api/0/organizations/{organization_id_or_slug}/projects/",
        {
          params: {
            path: {
              organization_id_or_slug: params.orgSlug,
            },
          },
        },
      );
      // Without the error the view renders the empty state, which reads as
      // "you have no projects".
      if (error) {
        return {
          data: undefined,
          pagination: undefined,
          errors: handleError(error, response),
        };
      }
      const pagination = getPaginationHeaders(response);
      return { data, pagination, errors: undefined };
    },
  });
  projects = computed(() => this.projectsResource.value()?.data);
  errors = computed(() => this.projectsResource.value()?.errors?.detail);
  hasError = computed(() => !!this.projectsResource.value()?.errors);
}

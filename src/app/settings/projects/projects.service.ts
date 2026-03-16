import { computed, Injectable, resource, signal } from "@angular/core";
import { client } from "src/app/shared/api/api";
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
      const { data, response } = await client.GET(
        "/api/0/organizations/{organization_slug}/projects/",
        {
          params: {
            path: {
              organization_slug: params.orgSlug,
            },
          },
        },
      );
      const pagination = getPaginationHeaders(response);
      return { data, pagination };
    },
  });
  projects = computed(() => this.projectsResource.value()?.data);
}

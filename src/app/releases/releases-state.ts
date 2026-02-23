import { computed, Injectable, signal } from "@angular/core";
import { apiResource } from "../shared/api/api-resource-factory";

@Injectable()
export class ReleasesService {
  params = signal<{ orgSlug: string; cursor: string | undefined } | undefined>(
    undefined,
  );
  #releasesResource = apiResource.paginated(this.params, (params) => ({
    url: "/api/0/organizations/{organization_slug}/releases/",
    options: {
      params: {
        path: {
          organization_slug: params.orgSlug,
        },
        query: {
          cursor: params.cursor,
        },
      },
    },
  }));
  releases = computed(() => this.#releasesResource.value()?.data || []);
  errors = computed(() => this.#releasesResource.serverError()?.detail);
  paginator = computed(() => this.#releasesResource.paginator());
  isLoading = computed(() => this.#releasesResource.isLoading());
  initialLoadComplete = computed(
    () => this.#releasesResource.hasValue() || !this.isLoading(),
  );
}

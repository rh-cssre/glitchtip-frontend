import { computed, Injectable, signal } from "@angular/core";
import { apiResource } from "../shared/api/api-resource-factory";
import { keepPreviousValue } from "../shared/signal.utils";
import { getPaginator } from "../shared/pagination.utils";

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
  // Keep the last page visible during a reload so the table doesn't blank out.
  #releasesData = keepPreviousValue(() => this.#releasesResource.value()?.data);
  #pagination = keepPreviousValue(
    () => this.#releasesResource.value()?.pagination,
  );
  releases = computed(() => this.#releasesData() ?? []);
  errors = computed(() => this.#releasesResource.serverError()?.detail);
  paginator = computed(() => getPaginator(this.#pagination()));
  isLoading = computed(() => this.#releasesResource.isLoading());
  initialLoadComplete = computed(
    () => this.#releasesResource.hasValue() || !this.isLoading(),
  );
}

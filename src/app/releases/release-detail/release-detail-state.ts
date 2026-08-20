import { Injectable, computed, signal } from "@angular/core";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { keepPreviousValue } from "src/app/shared/signal.utils";
import { getPaginator } from "src/app/shared/pagination.utils";

@Injectable()
export class ReleaseDetailService {
  params = signal<{ orgSlug: string; version: string } | undefined>(undefined);
  queryParams = signal<{ cursor: string | undefined } | undefined>(undefined);
  releaseFilesParams = computed(() => {
    const params = this.params();
    const queryParams = this.queryParams();
    if (!params || !queryParams) {
      return undefined;
    }
    return {
      orgSlug: params?.orgSlug,
      version: params?.version,
      cursor: queryParams?.cursor,
    };
  });
  #releaseResource = apiResource(this.params, (params) => ({
    url: "/api/0/organizations/{organization_slug}/releases/{version}/",
    options: {
      params: {
        path: {
          organization_slug: params.orgSlug,
          version: params.version,
        },
      },
    },
  }));
  #releaseFilesResource = apiResource.paginated(
    this.releaseFilesParams,
    (params) => ({
      url: "/api/0/organizations/{organization_slug}/releases/{version}/files/",
      options: {
        params: {
          path: {
            organization_slug: params.orgSlug,
            version: params.version,
          },
          query: {
            cursor: params.cursor,
          },
        },
      },
    }),
  );
  // Keep the last page of files visible during a reload so the table doesn't blank out.
  #releaseFilesData = keepPreviousValue(
    () => this.#releaseFilesResource.value()?.data,
  );
  #pagination = keepPreviousValue(
    () => this.#releaseFilesResource.value()?.pagination,
  );
  release = computed(() => this.#releaseResource.value());
  releaseFiles = computed(() => this.#releaseFilesData() ?? []);
  releaseFileErrors = computed(
    () => this.#releaseFilesResource.serverError()?.detail,
  );
  paginator = computed(() => getPaginator(this.#pagination()));
  loading = computed(
    () =>
      this.#releaseFilesResource.isLoading() ||
      this.#releaseResource.isLoading(),
  );
  initialLoadComplete = computed(
    () =>
      (this.#releaseFilesResource.hasValue() &&
        this.#releaseResource.hasValue()) ||
      !this.loading(),
  );
}

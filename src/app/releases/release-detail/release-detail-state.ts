import { Injectable, computed, signal } from "@angular/core";
import { apiResource } from "src/app/shared/api/api-resource-factory";

@Injectable()
export class ReleaseDetailService {
  params = signal<{ orgSlug: string; version: string } | undefined>(undefined);
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
  #releaseFilesResource = apiResource.paginated(this.params, (params) => ({
    url: "/api/0/organizations/{organization_slug}/releases/{version}/files/",
    options: {
      params: {
        path: {
          organization_slug: params.orgSlug,
          version: params.version,
        },
      },
    },
  }));
  release = computed(() => this.#releaseResource.value());
  releaseFiles = computed(() => this.#releaseFilesResource.value()?.data || []);
  releaseFileErrors = computed(
    () => this.#releaseFilesResource.serverError()?.detail,
  );
  paginator = computed(() => this.#releaseFilesResource.paginator());
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

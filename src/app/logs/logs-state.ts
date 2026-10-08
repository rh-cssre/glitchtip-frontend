import { computed, effect, Injectable, signal, inject } from "@angular/core";
import { OrganizationsService } from "../api/organizations.service";
import { apiResource } from "../shared/api/api-resource-factory";

export interface LogsParams {
  orgSlug: string;
  cursor?: string;
  level?: string[];
  service?: string;
  query?: string;
  project?: string[];
  start?: string;
  end?: string;
}

@Injectable()
export class LogsService {
  private organizationsService = inject(OrganizationsService);
  params = signal<LogsParams | undefined>(undefined);

  // Track accumulated logs for "load more"
  #accumulatedLogs = signal<any[]>([]);
  #isLoadingMore = signal(false);
  #initialHitCount = signal<string | undefined>(undefined);

  #logsResource = apiResource.paginated(this.params, (params) => ({
    url: "/api/0/organizations/{organization_id_or_slug}/logs/",
    options: {
      params: {
        path: {
          organization_id_or_slug: this.organizationsService.orgIdOrSlug(
            params.orgSlug,
          ),
        },
        query: {
          cursor: params.cursor,
          level: params.level,
          service: params.service,
          query: params.query,
          project: params.project?.map(Number),
          start: params.start,
          end: params.end,
          limit: 200,
        },
      },
    },
  }));

  // Services list for filter dropdown
  #orgSlug = computed(() => this.params()?.orgSlug);
  #servicesResource = apiResource(this.#orgSlug, (orgSlug) => ({
    url: "/api/0/organizations/{organization_id_or_slug}/logs/resources/",
    options: {
      params: {
        path: {
          organization_id_or_slug:
            this.organizationsService.orgIdOrSlug(orgSlug),
        },
        query: {
          resource_type: "service",
        },
      },
    },
  }));

  constructor() {
    // When resource loads, handle accumulation
    effect(() => {
      // .value() throws in the error state, which would abort this effect.
      if (this.#logsResource.error()) {
        this.#isLoadingMore.set(false);
        return;
      }
      const result = this.#logsResource.value();
      const data = result?.data;
      if (!data) return;

      const params = this.params();
      if (params?.cursor) {
        // Loading more - append to existing
        this.#accumulatedLogs.update((prev) => [...prev, ...data]);
      } else {
        // Fresh load - replace and capture hit count
        this.#accumulatedLogs.set(data);
        const count = this.paginator()?.count;
        if (count) {
          this.#initialHitCount.set(count);
        }
      }
      this.#isLoadingMore.set(false);
    });
  }

  // Expose accumulated logs
  logs = computed(() => this.#accumulatedLogs());
  errors = computed(() => this.#logsResource.serverError()?.detail);
  hasError = computed(() => !!this.#logsResource.serverError());
  isLoading = computed(
    () => this.#logsResource.isLoading() && !this.#isLoadingMore(),
  );
  isLoadingMore = computed(() => this.#isLoadingMore());
  initialLoadComplete = computed(
    () => this.#logsResource.hasValue() || this.hasError(),
  );

  // Pagination
  paginator = computed(() => this.#logsResource.paginator());
  hasNextPage = computed(() => this.paginator()?.hasNextPage ?? false);
  hitCount = computed(() => this.#initialHitCount() ?? this.paginator()?.count);

  // A failed filter request should not take the page down with it.
  services = computed(() =>
    this.#servicesResource.error()
      ? []
      : (this.#servicesResource.value() ?? []),
  );
  servicesLoading = computed(() => this.#servicesResource.isLoading());

  loadMore() {
    const nextParams = this.paginator()?.nextPageParams;
    const cursor = nextParams?.cursor?.[0];
    if (!cursor) return;

    const currentParams = this.params();
    if (!currentParams) return;

    this.#isLoadingMore.set(true);
    this.params.set({
      ...currentParams,
      cursor,
    });
  }

  // Reset the cached hit count on filter change; rows are intentionally NOT
  // cleared so gt-loading-overlay can dim them until the new page replaces them.
  resetHitCount() {
    this.#initialHitCount.set(undefined);
  }
}

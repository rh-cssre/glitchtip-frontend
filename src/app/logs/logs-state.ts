import { computed, effect, Injectable, signal } from "@angular/core";
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
  params = signal<LogsParams | undefined>(undefined);

  // Track accumulated logs for "load more"
  #accumulatedLogs = signal<any[]>([]);
  #isLoadingMore = signal(false);
  #initialHitCount = signal<string | undefined>(undefined);

  #logsResource = apiResource.paginated(this.params, (params) => ({
    url: "/api/0/organizations/{organization_slug}/logs/",
    options: {
      params: {
        path: {
          organization_slug: params.orgSlug,
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
    url: "/api/0/organizations/{organization_slug}/logs/resources/",
    options: {
      params: {
        path: {
          organization_slug: orgSlug,
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

  services = computed(() => this.#servicesResource.value() || []);
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

  // Reset accumulated logs when filters change (called by component)
  resetAccumulation() {
    this.#accumulatedLogs.set([]);
    this.#initialHitCount.set(undefined);
  }
}

import { computed, Injectable, resource, signal } from "@angular/core";
import { client, handleError } from "src/app/shared/api/api";
import {
  getPaginationHeaders,
  getPaginator,
} from "src/app/shared/pagination.utils";
import { keepPreviousValue } from "src/app/shared/signal.utils";

@Injectable()
export class MonitorChecksService {
  #params = signal<
    | {
        orgSlug: string;
        id: number;
        isChange: boolean;
        cursor: string | undefined;
      }
    | undefined
  >(undefined);
  #monitorChecks = resource({
    params: () => ({ params: this.#params() }),
    loader: async ({ params }) => {
      if (!params.params) {
        return undefined;
      }
      const { data, error, response } = await client.GET(
        "/api/0/organizations/{organization_id_or_slug}/monitors/{monitor_id}/checks/",
        {
          params: {
            path: {
              organization_id_or_slug: params.params.orgSlug,
              monitor_id: params.params.id,
            },
            query: {
              cursor: params.params.cursor,
              is_change: params.params.isChange ? true : null,
            },
          },
        },
      );
      if (error) {
        return {
          data,
          errors: handleError(error, response),
          pagination: undefined,
        };
      }
      const pagination = getPaginationHeaders(response);
      return {
        data,
        errors: undefined,
        pagination,
      };
    },
  });
  // Keep the last page visible during a reload so the table doesn't blank out.
  #monitorChecksData = keepPreviousValue(
    () => this.#monitorChecks.value()?.data,
  );
  monitorChecks = computed(() => this.#monitorChecksData() ?? []);
  loading = computed(() => this.#monitorChecks.isLoading());
  initialLoadComplete = computed(
    () => this.#monitorChecks.hasValue() || !this.#monitorChecks.isLoading(),
  );
  errors = computed(() => this.#monitorChecks.value()?.errors?.detail);
  hasError = computed(() => !!this.#monitorChecks.value()?.errors);
  pagination = keepPreviousValue(() => this.#monitorChecks.value()?.pagination);
  paginator = computed(() => getPaginator(this.pagination()));

  setParams(
    orgSlug: string,
    id: number,
    isChange: boolean,
    cursor: string | undefined,
  ) {
    this.#params.set({ orgSlug, id, isChange, cursor });
  }
}

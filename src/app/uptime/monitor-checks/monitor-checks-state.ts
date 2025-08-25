import { computed, Injectable, resource, signal } from "@angular/core";
import {
  client,
  handleError,
  NinjaErrorResponse,
} from "src/app/shared/api/api";
import {
  getPaginationHeaders,
  getPaginator,
} from "src/app/shared/pagination.utils";

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
        "/api/0/organizations/{organization_slug}/monitors/{monitor_id}/checks/",
        {
          params: {
            path: {
              organization_slug: params.params.orgSlug,
              monitor_id: params.params.id,
            },
            query: {
              cursor: params.params.cursor,
              is_change: params.params.isChange,
            },
          },
        },
      );
      const pagination = getPaginationHeaders(response);
      let errors: NinjaErrorResponse | undefined;
      if (error) {
        errors = handleError(error, response);
      }
      return { data, errors, pagination };
    },
  });
  monitorChecks = computed(() => this.#monitorChecks.value()?.data || []);
  loading = computed(() => this.#monitorChecks.isLoading());
  initialLoadComplete = computed(
    () => this.#monitorChecks.hasValue() || !this.#monitorChecks.isLoading(),
  );
  pagination = computed(() => this.#monitorChecks.value()?.pagination);
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

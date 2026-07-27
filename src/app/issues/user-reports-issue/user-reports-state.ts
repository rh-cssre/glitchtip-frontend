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
import { keepPreviousValue } from "src/app/shared/signal.utils";

@Injectable()
export class UserReportsService {
  issueID = signal("");
  cursor = signal("");
  #reportsResource = resource({
    params: () => ({ issueID: this.issueID(), cursor: this.cursor() }),
    loader: async ({ params }) => {
      if (!params.issueID) {
        return undefined;
      }
      const { data, response, error } = await client.GET(
        "/api/0/issues/{issue_id}/user-reports/",
        {
          params: {
            path: {
              issue_id: parseInt(params.issueID),
            },
          },
        },
      );
      let errors: NinjaErrorResponse | null = null;
      if (!data) {
        errors = handleError(error, response);
      }
      const pagination = getPaginationHeaders(response);
      return { data, pagination, errors };
    },
  });
  // Keep the last page visible during a reload so the list doesn't blank out.
  #reportsData = keepPreviousValue(() => this.#reportsResource.value()?.data);
  reports = computed(() => this.#reportsData() ?? []);
  errors = computed(() => this.#reportsResource.value()?.errors?.detail[0].msg);
  pagination = keepPreviousValue(
    () => this.#reportsResource.value()?.pagination,
  );
  paginator = computed(() => getPaginator(this.pagination()));
  loading = computed(() => this.#reportsResource.isLoading());

  setParams(issueID: string, cursor: string) {
    this.issueID.set(issueID);
    this.cursor.set(cursor);
  }
}

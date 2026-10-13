import { Injectable, computed, inject, resource, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { client, handleError } from "src/app/shared/api/api";
import { OrganizationsService } from "src/app/api/organizations.service";
import {
  getPaginationHeaders,
  getPaginator,
} from "src/app/shared/pagination.utils";
import { keepPreviousValue } from "src/app/shared/signal.utils";

export type MonitorSort =
  | "status"
  | "-created"
  | "created"
  | "name"
  | "project";

export const DEFAULT_MONITOR_SORT: MonitorSort = "-created";

// Menu order, and the only list of sorts: the dropdown renders it and
// toMonitorSort validates against it. Each option carries its own direction,
// so "Sort by" is the single control.
export const monitorSorts: { param: MonitorSort; display: string }[] = [
  { param: "status", display: "Down First" },
  { param: "-created", display: "Newest" },
  { param: "created", display: "Oldest" },
  { param: "name", display: "Name (A-Z)" },
  { param: "project", display: "Project (A-Z)" },
];

// The sort arrives off the URL, so anything the menu does not offer -- a stale
// bookmark, a hand-edited query string -- falls back to the default rather
// than leaving the dropdown blank or taking a 422.
export const toMonitorSort = (value: string | undefined): MonitorSort =>
  monitorSorts.find((sort) => sort.param === value)?.param ??
  DEFAULT_MONITOR_SORT;

@Injectable()
export class MonitorListService {
  private snackBar = inject(MatSnackBar);
  private organizationsService = inject(OrganizationsService);
  cursor = signal<string | undefined>(undefined);
  sort = signal<MonitorSort>(DEFAULT_MONITOR_SORT);
  private monitorsResource = resource({
    params: () => ({
      organizationSlug: this.activeOrganizationSlug(),
      cursor: this.cursor(),
      sort: this.sort(),
    }),
    // Define an async loader that retrieves data.
    // The resource calls this function every time the `request` value changes.
    loader: async ({ params }) => {
      const { error, data, response } = await client.GET(
        "/api/0/organizations/{organization_id_or_slug}/monitors/",
        {
          params: {
            path: this.organizationsService.orgPath(params.organizationSlug),
            query: { cursor: params.cursor, sort: params.sort },
          },
        },
      );
      if (error) {
        this.snackBar.open(
          $localize`There was an error retrieving your uptime monitors.`,
        );
        return {
          data: undefined,
          pagination: undefined,
          errors: handleError(error, response),
        };
      }
      const pagination = getPaginationHeaders(response);
      return { data, pagination, errors: undefined };
    },
  });
  loading = computed(() => this.monitorsResource.isLoading());
  // Keep the last page visible during a reload so the table doesn't blank out.
  #monitorsData = keepPreviousValue(() => this.monitorsResource.value()?.data);
  monitors = computed(() => this.#monitorsData() ?? []);
  pagination = keepPreviousValue(
    () => this.monitorsResource.value()?.pagination,
  );
  paginator = computed(() => getPaginator(this.pagination()));
  initialLoadComplete = computed(
    () => this.monitorsResource.hasValue() || !this.loading(),
  );
  errors = computed(() => this.monitorsResource.value()?.errors?.detail);
  hasError = computed(() => !!this.monitorsResource.value()?.errors);
  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
}

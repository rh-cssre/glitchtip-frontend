import { Injectable, computed, inject, resource, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { client } from "src/app/shared/api/api";
import { OrganizationsService } from "src/app/api/organizations.service";
import {
  getPaginationHeaders,
  getPaginator,
} from "src/app/shared/pagination.utils";
import { keepPreviousValue } from "src/app/shared/signal.utils";

export type MonitorSortField = "created" | "name" | "project" | "status";
export type MonitorSort = MonitorSortField | `-${MonitorSortField}`;

// Sort fields in menu order. Direction is the reverse checkbox's job.
export const monitorSorts: { param: MonitorSortField; display: string }[] = [
  { param: "created", display: "Created" },
  { param: "name", display: "Name" },
  { param: "project", display: "Project" },
  { param: "status", display: "Status" },
];

// Each field's two directions. Unreversed is the one worth defaulting to:
// newest first, names A-Z, and down before up -- what the list is opened for
// during an incident.
const directions: Record<
  MonitorSortField,
  { forward: MonitorSort; reversed: MonitorSort }
> = {
  created: { forward: "-created", reversed: "created" },
  name: { forward: "name", reversed: "-name" },
  project: { forward: "project", reversed: "-project" },
  status: { forward: "status", reversed: "-status" },
};

export const toMonitorSort = (
  field: MonitorSortField,
  reverse: boolean,
): MonitorSort =>
  reverse ? directions[field].reversed : directions[field].forward;

// Read the URL's sort back into the two controls. Anything unrecognised falls
// back to the default, so a hand-edited URL cannot put the dropdown and the
// request out of step.
export const fromMonitorSort = (sort: string | undefined) => {
  const fields = Object.keys(directions) as MonitorSortField[];
  const field =
    fields.find((candidate) =>
      Object.values(directions[candidate]).includes(sort as MonitorSort),
    ) ?? "created";
  return { field, reverse: directions[field].reversed === sort };
};

@Injectable()
export class MonitorListService {
  private snackBar = inject(MatSnackBar);
  private organizationsService = inject(OrganizationsService);
  cursor = signal<string | undefined>(undefined);
  sort = signal<MonitorSort>("-created");
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
        "/api/0/organizations/{organization_slug}/monitors/",
        {
          params: {
            path: { organization_slug: params.organizationSlug },
            query: { cursor: params.cursor, sort: params.sort },
          },
        },
      );
      if (error) {
        this.snackBar.open(
          $localize`There was an error retrieving your uptime monitors.`,
        );
      }
      const pagination = getPaginationHeaders(response);
      return { data, pagination };
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
  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
}

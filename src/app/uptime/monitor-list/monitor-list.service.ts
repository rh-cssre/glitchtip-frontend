import { Injectable, computed, inject, resource, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { client } from "src/app/shared/api/api";
import { OrganizationsService } from "src/app/api/organizations.service";
import {
  getPaginationHeaders,
  getPaginator,
} from "src/app/shared/pagination.utils";

@Injectable()
export class MonitorListService {
  private snackBar = inject(MatSnackBar);
  private organizationsService = inject(OrganizationsService);
  cursor = signal<string | undefined>(undefined);
  private monitorsResource = resource({
    params: () => ({
      organizationSlug: this.activeOrganizationSlug(),
      cursor: this.cursor(),
    }),
    // Define an async loader that retrieves data.
    // The resource calls this function every time the `request` value changes.
    loader: async ({ params }) => {
      const { error, data, response } = await client.GET(
        "/api/0/organizations/{organization_slug}/monitors/",
        {
          params: {
            path: { organization_slug: params.organizationSlug },
            query: { cursor: params.cursor },
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
  monitors = computed(() => this.monitorsResource.value()?.data);
  pagination = computed(() => this.monitorsResource.value()?.pagination);
  paginator = computed(() => getPaginator(this.pagination()));
  activeOrganizationSlug = this.organizationsService.activeOrganizationSlug;
}

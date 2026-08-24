import { Injectable, computed, inject, signal } from "@angular/core";
import { OrganizationsService } from "../../api/organizations.service";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { keepPreviousValue } from "src/app/shared/signal.utils";
import { getPaginator } from "src/app/shared/pagination.utils";

interface DataParams {
  orgSlug: string;
  cursor?: string;
  query?: string;
  start?: string;
  end?: string;
  sort?: string;
  project?: string[];
  environment?: string;
}

@Injectable()
export class PerformanceService {
  private organizationsService = inject(OrganizationsService);

  params = signal<DataParams | undefined>(undefined);
  #transactionGroupsResource = apiResource.paginated(this.params, (params) => ({
    url: "/api/0/organizations/{organization_slug}/transaction-groups/",
    options: {
      params: {
        path: { organization_slug: params.orgSlug },
        query: {
          cursor: params.cursor,
          query: params.query,
          start: params.start,
          end: params.end,
          sort: params.sort as any,
          project: params.project?.map(Number),
          environment: params.environment ? [params.environment] : undefined,
        },
      },
    },
  }));

  // Keep the last page visible during a reload so the table doesn't blank out.
  #transactionGroupsData = keepPreviousValue(
    () => this.#transactionGroupsResource.value()?.data,
  );
  #pagination = keepPreviousValue(
    () => this.#transactionGroupsResource.value()?.pagination,
  );
  transactionGroups = computed(() => this.#transactionGroupsData() ?? []);
  transactionGroupsDisplay = computed(() => {
    const projects = this.organizationsService.activeOrganizationProjects();
    const groups = this.transactionGroups();
    return groups.map((group) => {
      const projectSlug = projects?.find(
        (project) => +project.id === (group as any).project,
      )?.name;
      return {
        ...group,
        projectSlug,
      };
    });
  });
  loading = computed(() => this.#transactionGroupsResource.isLoading());
  initialLoadComplete = computed(
    () => this.#transactionGroupsResource.hasValue() || !this.loading(),
  );
  errors = computed(
    () => this.#transactionGroupsResource.serverError()?.detail,
  );
  paginator = computed(() => getPaginator(this.#pagination()));
}

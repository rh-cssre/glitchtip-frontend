import { Injectable, computed, inject, resource, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { client } from "../shared/api/api";
import { StatefulService } from "../shared/stateful-service/signal-state.service";
import { getPaginationHeaders, getPaginator } from "../shared/pagination.utils";
import { IssueStatus, StatsPeriod } from "./interfaces";
import { apiResource } from "../shared/api/api-resource-factory";

export interface DataParams {
  orgSlug: string;
  cursor?: string;
  query?: string;
  start?: string;
  end?: string;
  sort?: string;
  project?: string[];
  environment?: string;
}

export interface IssuesState {
  selectedIssues: string[];
  allResultsSelected: boolean;
}

const initialState: IssuesState = {
  selectedIssues: [],
  allResultsSelected: false,
};

type AllowedSortKey =
  | "priority"
  | "first_seen"
  | "count"
  | "-last_seen"
  | "-count"
  | "-priority";

const allowedSortKeys = [
  "priority",
  "first_seen",
  "count",
  "-last_seen",
  "-count",
  "-priority",
] as const;

function isAllowedSortKey(key: string): key is AllowedSortKey {
  return (allowedSortKeys as readonly string[]).includes(key);
}

@Injectable()
export class IssuesService extends StatefulService<IssuesState> {
  private snackbar = inject(MatSnackBar);
  private router = inject(Router);
  protected route = inject(ActivatedRoute);
  private params = signal<DataParams | undefined>(undefined);

  statsPeriod = signal<StatsPeriod>("24h");

  private issuesResource = resource({
    params: () => ({ params: this.params() }),
    loader: async ({ params }) => {
      if (!params.params) {
        return undefined;
      }
      const sort: AllowedSortKey | undefined =
        params.params?.sort && isAllowedSortKey(params.params.sort)
          ? params.params.sort
          : undefined;
      const { error, data, response } = await client.GET(
        "/api/0/organizations/{organization_slug}/issues/",
        {
          params: {
            path: { organization_slug: params.params.orgSlug },
            query: {
              cursor: params.params.cursor,
              query: params.params.query,
              start: params.params.start,
              end: params.params.end,
              sort,
              project: params.params.project?.map((p) => parseInt(p)),
              environment: params.params.environment
                ? [params.params.environment]
                : undefined,
            },
          },
        },
      );
      if (error) {
        this.snackbar.open(
          $localize`There was an error when attempting to load issues.`,
        );
      }
      const pagination = getPaginationHeaders(response);
      if (
        response.headers.has("x-sentry-direct-hit") &&
        response.headers.get("x-sentry-direct-hit") === "1" &&
        data.length &&
        data[0].matchingEventId
      ) {
        const directHit = data[0];
        this.router.navigate(
          [directHit.id, "events", directHit.matchingEventId],
          {
            relativeTo: this.route,
            queryParams: { query: null },
            queryParamsHandling: "merge",
            replaceUrl: true, // so the browser back button works
          },
        );
      }
      return { data, pagination };
    },
  });
  loading = computed(() => this.issuesResource.isLoading());
  issues = computed(() => this.issuesResource.value()?.data);
  private issueStatsParams = computed(() => {
    const params = this.params();
    const issues = this.issues();
    const statsPeriod = this.statsPeriod();
    if (!params || !issues) {
      return undefined;
    }
    return {
      issueIDs: issues.map((issue) => parseInt(issue.id)),
      orgSlug: params.orgSlug,
      statsPeriod,
    };
  });
  private issueStatsResource = apiResource(this.issueStatsParams, (params) => {
    const queryParams: any = {
      groups: params.issueIDs,
      statsPeriod: params.statsPeriod,
    };

    return {
      url: "/api/0/organizations/{organization_slug}/issues-stats/",
      options: {
        params: {
          path: {
            organization_slug: params.orgSlug,
          },
          query: queryParams,
        },
      },
    };
  });
  // Array of timestamps across selected period
  // counting back from present. Used for empty chart state
  // and as basis for formatted chart data
  statsChartDataFrame = computed(() => {
    const period = this.statsPeriod();
    const count = this.statsPeriod() === "14d" ? 14 : 24;
    return Array.from({ length: count }, (_, i) => {
      const baseTimeRef = new Date();
      const interval = i + 1 - count;
      let utcTimestamp: number;
      if (period === "14d") {
        utcTimestamp = Date.UTC(
          baseTimeRef.getUTCFullYear(),
          baseTimeRef.getUTCMonth(),
          baseTimeRef.getUTCDate() + interval,
          0,
          0,
          0,
        );
      } else {
        utcTimestamp = Date.UTC(
          baseTimeRef.getUTCFullYear(),
          baseTimeRef.getUTCMonth(),
          baseTimeRef.getUTCDate(),
          baseTimeRef.getUTCHours() + interval,
          0,
          0,
        );
      }
      return {
        name: utcTimestamp.toString(),
        timestamp: utcTimestamp,
      };
    });
  });
  formattedStatsChartData = computed(() => {
    const statsResource = this.issueStatsResource.value();
    const frameArray = this.statsChartDataFrame();
    const period = this.statsPeriod();
    if (!statsResource) {
      return [];
    }
    return statsResource.map((issue) => {
      const stats = period in issue.stats ? issue.stats[period] : null;
      const mappedStats = new Map<number, number>(
        stats?.map(([ts, val]) => [ts, val]),
      );
      const formattedStats = frameArray.map((datapoint) => {
        return {
          ...datapoint,
          value: mappedStats.get(datapoint.timestamp / 1000) ?? 0,
        };
      });
      return { ...issue, formattedStats };
    });
  });

  pagination = computed(() => this.issuesResource.value()?.pagination);
  paginator = computed(() => getPaginator(this.pagination()));
  initialLoad = computed(
    () => !this.issuesResource.isLoading() && this.issuesResource.hasValue(),
  );
  issueStatsLoading = computed(() => this.issueStatsResource.isLoading());
  issuesWithStats = computed(() => {
    const issues = this.issues();
    if (!issues) {
      return [];
    }
    return issues.map((issue) => ({
      ...issue,
      formattedStats:
        this.formattedStatsChartData().find((stat) => stat.id === issue.id)
          ?.formattedStats || [],
    }));
  });
  selectedIssues = computed(() => this.state().selectedIssues);
  issuesWithSelected = computed(() =>
    this.issuesWithStats().map((issue) => ({
      ...issue,
      isSelected: this.selectedIssues().includes(issue.id),
      projectSlug: issue.project?.slug,
    })),
  );
  areAllSelected = computed(() => {
    const issues = this.issues();
    return (
      issues && issues.length === this.selectedIssues().length && issues.length
    );
  });
  numberOfSelectedIssues = computed(() => this.selectedIssues().length);
  thereAreSelectedIssues = computed(() => this.numberOfSelectedIssues() > 0);
  allResultsSelected = computed(() => this.state().allResultsSelected);

  constructor() {
    super(initialState);
  }

  updateParams(params: DataParams) {
    this.params.set(params);
  }

  toggleSelectOne(issueId: string) {
    const selectedIssues = this.selectedIssues();
    let updatedSelection = [];
    if (selectedIssues.includes(issueId)) {
      updatedSelection = selectedIssues.filter((issue) => issue !== issueId);
    } else {
      updatedSelection = selectedIssues.concat([issueId]);
    }
    this.setUpdateSelectedIssues(updatedSelection);
  }

  selectRange(issueIds: string[]) {
    const selectedIssues = this.selectedIssues();
    const updatedSelection = [
      ...new Set([...selectedIssues, ...issueIds]),
    ];
    this.setUpdateSelectedIssues(updatedSelection);
  }

  deselectRange(issueIds: string[]) {
    const idsToRemove = new Set(issueIds);
    const updatedSelection = this.selectedIssues().filter(
      (id) => !idsToRemove.has(id),
    );
    this.setUpdateSelectedIssues(updatedSelection);
  }

  toggleSelectAllOnPage() {
    if (this.issues()?.length === this.selectedIssues().length) {
      this.setCancelAllOnPageSelection();
    } else {
      this.setSelectAllOnPage();
    }
  }

  selectAllResults() {
    this.setAllResultsSelected();
  }

  cancelAllResultsSelection() {
    this.setCancelAllResultsSelection();
  }

  async updateStatusByIssueId(orgSlug: string, status: IssueStatus) {
    const issues = this.selectedIssues();
    if (status === "merge") {
      await this.mergeIssues(orgSlug, issues);
    } else {
      const { data, error } = await client.PUT(
        "/api/0/organizations/{organization_slug}/issues/",
        {
          params: {
            path: {
              organization_slug: orgSlug,
            },
            query: {
              id: issues.map((issue) => parseInt(issue)),
            },
          },
          body: {
            status,
          },
        },
      );
      if (data?.status) {
        this.setUpdateStatusByIssueIdComplete(issues, data?.status);
      }
      if (error) {
        this.snackbar.open($localize`Error, unable to update issue`);
      }
    }
  }

  async mergeIssues(orgSlug: string, issues: string[]) {
    await client.PUT("/api/0/organizations/{organization_slug}/issues/", {
      params: {
        path: {
          organization_slug: orgSlug,
        },
        query: {
          id: issues.map((issue) => parseInt(issue)),
        },
      },
      body: { merge: 1 },
    });
    this.issuesResource.reload();
  }

  async bulkUpdateStatus(
    status: IssueStatus,
    orgSlug: string,
    projectIds: string[],
    query?: string | null,
    start?: string | undefined,
    end?: string | undefined,
    environment?: string | undefined,
  ) {
    if (status === "merge") {
      return;
    }
    const { data, error } = await client.PUT(
      "/api/0/organizations/{organization_slug}/issues/",
      {
        params: {
          path: {
            organization_slug: orgSlug,
          },
          query: {
            project: projectIds?.map((id) => parseInt(id)),
            query,
            start,
            end,
            environment: environment ? [environment] : undefined,
          },
        },
        body: {
          status,
        },
      },
    );
    if (error) {
      this.snackbar.open($localize`Error, unable to update issue`);
    }
    if (data) {
      this.setBulkUpdateComplete(status);
    }
  }

  private setUpdateSelectedIssues(selectedIssues: string[]) {
    this.setState({
      selectedIssues,
      allResultsSelected: false,
    });
  }

  private setSelectAllOnPage() {
    const issues = this.issues();
    if (issues) {
      this.setState({
        selectedIssues: issues.map((issue) => issue.id),
      });
    }
  }

  private setCancelAllOnPageSelection() {
    this.setState({
      selectedIssues: [],
      allResultsSelected: false,
    });
  }

  private setAllResultsSelected() {
    const issues = this.issues();
    this.setState({
      allResultsSelected: true,
      selectedIssues: issues ? issues.map((issue) => issue.id) : [],
    });
  }

  private setCancelAllResultsSelection() {
    this.setState({
      allResultsSelected: false,
    });
  }

  private setUpdateStatusByIssueIdComplete(
    issueIds: string[],
    status: IssueStatus,
  ) {
    this.setState({
      selectedIssues: [],
    });
    this.issuesResource.update((update) => {
      if (update !== undefined) {
        return {
          ...update,
          data: [
            ...update.data.map((issue) =>
              issueIds.includes(issue.id) ? { ...issue, status } : issue,
            ),
          ],
        };
      }
      return update;
    });
  }

  private setBulkUpdateComplete(status: IssueStatus) {
    this.setState({
      selectedIssues: [],
      allResultsSelected: false,
    });
    this.issuesResource.update((update) => {
      if (update !== undefined) {
        return {
          ...update,
          data: [...update.data.map((issue) => ({ ...issue, status }))],
        };
      }
      return update;
    });
  }
}

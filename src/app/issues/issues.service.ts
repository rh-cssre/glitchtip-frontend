import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, Observable, EMPTY } from "rxjs";
import { tap, catchError, map, take } from "rxjs/operators";
import { Issue, IssueWithSelected, IssueStatus } from "./interfaces";
import { IssuesAPIService } from "../api/issues/issues-api.service";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";
import { Environment } from "../api/organizations/organizations.interface";
import { OrganizationAPIService } from "../api/organizations/organizations-api.service";

export interface IssuesState extends PaginationStatefulServiceState {
  issues: Issue[];
  selectedIssues: number[];
  organizationEnvironments: Environment[];
  selectedProjectInfo: { orgSlug?: string; projectId?: string; query?: string };
  areIssuesForProjectSelected: boolean;
  errors: string[];
}

const initialState: IssuesState = {
  issues: [],
  selectedIssues: [],
  pagination: initialPaginationState,
  organizationEnvironments: [],
  selectedProjectInfo: {},
  areIssuesForProjectSelected: false,
  errors: [],
};

@Injectable({
  providedIn: "root",
})
export class IssuesService extends PaginationStatefulService<IssuesState> {
  issues$ = this.getState$.pipe(map((state) => state.issues));
  selectedIssues$ = this.getState$.pipe(map((state) => state.selectedIssues));
  issuesWithSelected$: Observable<IssueWithSelected[]> = combineLatest([
    this.issues$,
    this.selectedIssues$,
  ]).pipe(
    map(([issues, selectedIssues]) =>
      issues.map((issue) => ({
        ...issue,
        isSelected: selectedIssues.includes(issue.id) ? true : false,
        projectSlug: issue.project?.slug,
      }))
    )
  );
  areAllSelected$ = combineLatest([this.issues$, this.selectedIssues$]).pipe(
    map(
      ([issues, selectedIssues]) =>
        issues.length === selectedIssues.length && issues.length > 0
    )
  );
  readonly searchHits$ = this.getState$.pipe(
    map((state) => state.pagination.hits)
  );
  readonly thereAreSelectedIssues$ = this.selectedIssues$.pipe(
    map((selectedIssues) => selectedIssues.length > 0)
  );
  readonly organizationEnvironments$ = this.getState$.pipe(
    map((data) => data.organizationEnvironments)
  );
  readonly numberOfSelectedIssues$ = this.getState$.pipe(
    map((state) => state.selectedIssues.length)
  );
  readonly selectedProjectInfo$ = this.getState$.pipe(
    map((state) => state.selectedProjectInfo)
  );
  readonly errors$ = this.getState$.pipe(map((state) => state.errors));
  /**
   * Uses reducer to remove duplicate environments, also converts objects to a
   * list of names since that's all that the component requires
   */
  readonly organizationEnvironmentsProcessed$ = this.organizationEnvironments$.pipe(
    map((environments) =>
      environments.reduce(
        (accumulator, environment) => [
          ...accumulator,
          ...(!accumulator.includes(environment.name)
            ? [environment.name]
            : []),
        ],
        [] as string[]
      )
    )
  );

  constructor(
    private snackbar: MatSnackBar,
    private issuesAPIService: IssuesAPIService,
    private organizationsAPIService: OrganizationAPIService
  ) {
    super(initialState);
  }

  /** Refresh issues data. orgSlug is required. */
  getIssues(
    orgSlug: string,
    cursor: string | undefined,
    query: string = "is:unresolved",
    project: string[] | null,
    start: string | undefined,
    end: string | undefined,
    sort: string | undefined,
    environment: string | undefined
  ) {
    this.setLoading(true);
    this.setErrors([]);
    this.retrieveIssues(
      orgSlug,
      cursor,
      query,
      project,
      start,
      end,
      sort,
      environment
    ).toPromise();
  }

  getOrganizationEnvironments(orgSlug: string) {
    return this.retrieveOrganizationEnvironments(orgSlug);
  }

  toggleSelected(issueId: number) {
    const state = this.state.getValue();
    let selectedIssues: number[];
    if (state.selectedIssues.includes(issueId)) {
      selectedIssues = state.selectedIssues.filter(
        (issue) => issue !== issueId
      );
    } else {
      selectedIssues = state.selectedIssues.concat([issueId]);
    }
    this.state.next({ ...state, selectedIssues });
  }

  toggleSelectAll() {
    const state = this.state.getValue();
    if (state.issues.length === state.selectedIssues.length) {
      this.state.next({
        ...state,
        selectedIssues: [],
      });
      this.clearBulkProjectUpdate();
    } else {
      this.state.next({
        ...state,
        selectedIssues: state.issues.map((issue) => issue.id),
      });
    }
  }

  /** Set one specified issue ID as status */
  setStatus(id: number, status: IssueStatus) {
    return this.updateStatus(status, [id]);
  }

  /** Set all selected issues to this status */
  bulkSetStatus(status: IssueStatus) {
    combineLatest([this.selectedIssues$, this.selectedProjectInfo$])
      .pipe(
        take(1),
        map(([selectedIssues, selectedProjectInfo]) => {
          return this.updateStatus(
            status,
            selectedIssues,
            selectedProjectInfo.orgSlug,
            selectedProjectInfo.projectId,
            selectedProjectInfo.query
          ).toPromise();
        })
      )
      .subscribe();
  }

  bulkUpdateIssuesForProject(
    orgSlug: string,
    projectId: string,
    query: string
  ) {
    this.setBulkUpdateIssuesForProject(orgSlug, projectId, query);
  }

  clearProjectInfo() {
    this.clearBulkProjectUpdate();
  }

  /** Get issues from backend using appropriate endpoint based on organization */
  private retrieveIssues(
    organizationSlug?: string,
    cursor?: string,
    query?: string,
    project?: string[] | null,
    start?: string,
    end?: string,
    sort?: string,
    environment?: string
  ) {
    return this.issuesAPIService
      .list(
        organizationSlug,
        cursor,
        query,
        project,
        start,
        end,
        sort,
        environment
      )
      .pipe(
        tap((res) => {
          this.setStateAndPagination({ issues: res.body! }, res);
        }),
        catchError((err: HttpErrorResponse) => {
          this.setLoading(false);
          this.setInitialLoadComplete(true);

          let errorArray: string[] = [];
          if (err.error) {
            const errorValues: string[][] = Object.values<string[]>(err.error);
            errorArray = errorValues.reduce((a, v) => a.concat(v), []);
          } else {
            errorArray = [err.message];
          }
          this.setErrors(errorArray);
          return EMPTY;
        })
      );
  }

  private updateStatus(
    status: IssueStatus,
    ids: number[],
    orgSlug?: string,
    projectId?: string,
    query?: string
  ) {
    return this.issuesAPIService
      .update(status, ids, orgSlug, projectId, query)
      .pipe(
        tap((resp) => {
          this.setIssueStatuses(ids, resp.status);
          this.clearBulkProjectUpdate();
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open("Error, unable to update issue");
          return EMPTY;
        })
      );
  }

  private clearBulkProjectUpdate() {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      selectedProjectInfo: {},
    });
  }

  private setBulkUpdateIssuesForProject(
    orgSlug?: string,
    projectId?: string,
    query?: string
  ) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      selectedProjectInfo: { orgSlug, projectId, query },
    });
  }

  private setIssueStatuses(issueIds: number[], status: IssueStatus) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      issues: state.issues.map((issue) =>
        issueIds.includes(issue.id) ? { ...issue, status } : issue
      ),
      selectedIssues: [],
    });
  }

  private setInitialLoadComplete(initialLoadComplete: boolean) {
    const state = this.state.getValue();
    this.setState({ pagination: { ...state.pagination, initialLoadComplete } });
  }

  private setLoading(loading: boolean) {
    const state = this.state.getValue();
    this.setState({ pagination: { ...state.pagination, loading } });
  }

  private setErrors(errors: string[]) {
    const state = this.state.getValue();
    this.setState({ ...state, errors });
  }

  private retrieveOrganizationEnvironments(orgSlug: string) {
    return this.organizationsAPIService
      .retrieveOrganizationEnvironments(orgSlug)
      .pipe(
        tap((environments) => {
          this.setState({ organizationEnvironments: environments });
        })
      );
  }
}

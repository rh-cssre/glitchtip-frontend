import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, Observable, EMPTY } from "rxjs";
import { tap, catchError, map, take, filter } from "rxjs/operators";
import {
  Issue,
  IssueWithSelected,
  IssueWithMatchingEvent,
  IssueStatus,
} from "./interfaces";
import { IssuesAPIService } from "../api/issues/issues-api.service";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";

export interface IssuesState extends PaginationStatefulServiceState {
  issues: Issue[];
  directHit?: IssueWithMatchingEvent;
  selectedIssues: number[];
  selectedProjectInfo: { orgSlug?: string; projectId?: string; query?: string };
  areIssuesForProjectSelected: boolean;
  errors: string[];
}

const initialState: IssuesState = {
  issues: [],
  selectedIssues: [],
  pagination: initialPaginationState,
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
  readonly searchDirectHit$ = this.getState$.pipe(
    map((state) => state.directHit),
    filter((directHit): directHit is IssueWithMatchingEvent => !!directHit)
  );
  readonly thereAreSelectedIssues$ = this.selectedIssues$.pipe(
    map((selectedIssues) => selectedIssues.length > 0)
  );
  readonly numberOfSelectedIssues$ = this.getState$.pipe(
    map((state) => state.selectedIssues.length)
  );
  readonly selectedProjectInfo$ = this.getState$.pipe(
    map((state) => state.selectedProjectInfo)
  );
  readonly errors$ = this.getState$.pipe(map((state) => state.errors));

  constructor(
    private snackbar: MatSnackBar,
    private issuesAPIService: IssuesAPIService
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
    this.state.next({ ...state, selectedIssues, directHit: undefined });
  }

  toggleSelectAll() {
    const state = this.state.getValue();
    if (state.issues.length === state.selectedIssues.length) {
      this.state.next({
        ...state,
        directHit: undefined,
        selectedIssues: [],
      });
      this.clearBulkProjectUpdate();
    } else {
      this.state.next({
        ...state,
        directHit: undefined,
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
    this.setIssuesLoading();
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
          let directHit: IssueWithMatchingEvent | undefined;
          if (
            res.headers.has("x-sentry-direct-hit") &&
            res.headers.get("x-sentry-direct-hit") === "1" &&
            res.body![0] &&
            (res.body![0] as IssueWithMatchingEvent).matchingEventId
          ) {
            directHit = res.body![0] as IssueWithMatchingEvent;
          }
          this.setStateAndPagination({ issues: res.body!, directHit }, res);
        }),
        catchError((err: HttpErrorResponse) => {
          this.setIssuesError(err);
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
      directHit: undefined,
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
      directHit: undefined,
      selectedProjectInfo: { orgSlug, projectId, query },
    });
  }

  private setIssuesLoading() {
    const state = this.state.getValue();
    this.setState({
      directHit: undefined,
      errors: [],
      pagination: { ...state.pagination, loading: true },
    });
  }

  private setIssueStatuses(issueIds: number[], status: IssueStatus) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      directHit: undefined,
      issues: state.issues.map((issue) =>
        issueIds.includes(issue.id) ? { ...issue, status } : issue
      ),
      selectedIssues: [],
    });
  }

  private setIssuesError(errors: HttpErrorResponse) {
    const state = this.state.getValue();
    this.setState({
      directHit: undefined,
      errors: this.updateErrorMessage(errors),
      pagination: {
        ...state.pagination,
        loading: false,
        initialLoadComplete: true,
      },
    });
  }

  private updateErrorMessage(err: HttpErrorResponse): string[] {
    if (err.error) {
      const errorValues: string[][] = Object.values<string[]>(err.error);
      return errorValues.reduce((a, v) => a.concat(v), []);
    } else {
      return [err.message];
    }
  }
}

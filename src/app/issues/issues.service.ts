import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, Observable, EMPTY } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { Issue, IssueWithSelected, IssueStatus } from "./interfaces";
import { IssuesAPIService } from "../api/issues/issues-api.service";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "../shared/stateful-service/pagination-stateful-service";

export interface IssuesState extends PaginationStatefulServiceState {
  issues: Issue[];
  selectedIssues: number[];
}

const initialState: IssuesState = {
  issues: [],
  selectedIssues: [],
  pagination: initialPaginationState,
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
    map(([issues, selectedIssues]) => issues.length === selectedIssues.length)
  );
  readonly thereAreSelectedIssues$ = this.selectedIssues$.pipe(
    map((selectedIssues) => selectedIssues.length > 0)
  );

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
    end: string | undefined
  ) {
    this.setLoading(true);
    this.retrieveIssues(
      orgSlug,
      cursor,
      query,
      project,
      start,
      end
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
    this.state.next({ ...state, selectedIssues });
  }

  toggleSelectAll() {
    const state = this.state.getValue();
    if (state.issues.length === state.selectedIssues.length) {
      this.state.next({
        ...state,
        selectedIssues: [],
      });
    } else {
      this.state.next({
        ...state,
        selectedIssues: state.issues.map((issue) => issue.id),
      });
    }
  }

  /** Set one specified issue ID as status */
  setStatus(id: number, status: IssueStatus) {
    return this.updateStatus([id], status);
  }

  /** Set all selected issues to this status */
  bulkSetStatus(status: IssueStatus) {
    const selectedIssues = this.state.getValue().selectedIssues;
    return this.updateStatus(selectedIssues, status).toPromise();
  }

  /** Get issues from backend using appropriate endpoint based on organization */
  private retrieveIssues(
    organizationSlug?: string,
    cursor?: string,
    query?: string,
    project?: string[] | null,
    start?: string,
    end?: string
  ) {
    return this.issuesAPIService
      .list(organizationSlug, cursor, query, project, start, end)
      .pipe(
        tap((res) => {
          this.setStateAndPagination({ issues: res.body! }, res);
        })
      );
  }

  private updateStatus(ids: number[], status: IssueStatus) {
    return this.issuesAPIService.update(ids, status).pipe(
      tap((resp) => this.setIssueStatuses(ids, resp.status)),
      catchError((err: HttpErrorResponse) => {
        this.snackbar.open("Error, unable to update issue");
        return EMPTY;
      })
    );
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

  private setLoading(loading: boolean) {
    const state = this.state.getValue();
    this.setState({ pagination: { ...state.pagination, loading } });
  }
}

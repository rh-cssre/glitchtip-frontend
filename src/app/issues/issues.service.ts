import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { combineLatest, Observable, EMPTY, lastValueFrom } from "rxjs";
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
import { parseErrorMessage } from "../shared/shared.utils";

export interface IssuesState extends PaginationStatefulServiceState {
  issues: Issue[];
  directHit?: IssueWithMatchingEvent;
  selectedIssues: number[];
  selectedProjectInfo: { orgSlug?: string; projectId?: string; query?: string };
  errors: string[];
}

const initialState: IssuesState = {
  issues: [],
  selectedIssues: [],
  pagination: initialPaginationState,
  selectedProjectInfo: {},
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

  getIssues(
    organizationSlug?: string,
    cursor?: string | null,
    query: string | null = "is:unresolved",
    project?: number[] | null,
    start?: string | null,
    end?: string | null,
    sort?: string | null,
    environment?: string | null
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

  toggleSelected(issueId: number) {
    lastValueFrom(
      this.selectedIssues$.pipe(
        take(1),
        tap((selectedIssues) => {
          let updatedSelection = [];
          if (selectedIssues.includes(issueId)) {
            updatedSelection = selectedIssues.filter(
              (issue) => issue !== issueId
            );
          } else {
            updatedSelection = selectedIssues.concat([issueId]);
          }
          this.setUpdateSelectedIssues(updatedSelection);
        })
      )
    );
  }

  toggleSelectAllOnPage() {
    lastValueFrom(
      combineLatest([this.issues$, this.selectedIssues$]).pipe(
        take(1),
        tap(([issues, selectedIssues]) => {
          if (issues.length === selectedIssues.length) {
            this.setCancelAllOnPageSelection();
          } else {
            this.setSelectAllOnPage();
          }
        })
      )
    );
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

  selectAllResults(orgSlug: string, projectId: string, query: string) {
    this.setAllResultsSelection(orgSlug, projectId, query);
  }

  cancelAllResultsSelection() {
    this.setCancelAllResultsSelection();
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
          this.setUpdateStatusComplete(ids, resp.status);
        }),
        catchError((err: HttpErrorResponse) => {
          this.snackbar.open("Error, unable to update issue");
          return EMPTY;
        })
      );
  }

  private setUpdateSelectedIssues(selectedIssues: number[]) {
    this.setState({
      selectedIssues,
    });
  }

  private setSelectAllOnPage() {
    const state = this.state.getValue();
    this.setState({
      directHit: undefined,
      selectedIssues: state.issues.map((issue) => issue.id),
    });
  }

  private setCancelAllOnPageSelection() {
    this.setState({
      directHit: undefined,
      selectedIssues: [],
      selectedProjectInfo: {},
    });
  }

  private setAllResultsSelection(
    orgSlug?: string,
    projectId?: string,
    query?: string
  ) {
    this.setState({
      directHit: undefined,
      selectedProjectInfo: { orgSlug, projectId, query },
    });
  }

  private setCancelAllResultsSelection() {
    this.setState({
      directHit: undefined,
      selectedProjectInfo: {},
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

  private setUpdateStatusComplete(issueIds: number[], status: IssueStatus) {
    const state = this.state.getValue();
    this.setState({
      directHit: undefined,
      issues: state.issues.map((issue) =>
        issueIds.includes(issue.id) ? { ...issue, status } : issue
      ),
      selectedIssues: [],
      selectedProjectInfo: {},
    });
  }

  private setIssuesError(errors: HttpErrorResponse) {
    const state = this.state.getValue();
    this.setState({
      directHit: undefined,
      errors: parseErrorMessage(errors),
      pagination: {
        ...state.pagination,
        loading: false,
        initialLoadComplete: true,
      },
    });
  }
}

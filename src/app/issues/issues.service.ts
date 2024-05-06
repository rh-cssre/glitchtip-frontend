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
  allResultsSelected: boolean;
  errors: string[];
}

const initialState: IssuesState = {
  issues: [],
  selectedIssues: [],
  pagination: initialPaginationState,
  allResultsSelected: false,
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
  readonly allResultsSelected$ = this.getState$.pipe(
    map((state) => state.allResultsSelected)
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

  toggleSelectOne(issueId: number) {
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

  selectAllResults() {
    this.setAllResultsSelected();
  }

  cancelAllResultsSelection() {
    this.setCancelAllResultsSelection();
  }

  updateStatusByIssueId(orgSlug: string, status: IssueStatus) {
    lastValueFrom(
      this.selectedIssues$.pipe(
        take(1),
        tap((issues) => {
          lastValueFrom(
            this.issuesAPIService.bulkUpdate(status, orgSlug, issues).pipe(
              tap((resp) => {
                this.setUpdateStatusByIssueIdComplete(issues, resp.status);
              }),
              catchError((err: HttpErrorResponse) => {
                this.snackbar.open("Error, unable to update issue");
                return EMPTY;
              })
            )
          );
        })
      )
    );
  }

  bulkUpdateStatus(
    status: IssueStatus,
    orgSlug: string,
    projectIds: number[],
    query?: string | null,
    start?: string | null,
    end?: string | null,
    environment?: string | null
  ) {
    lastValueFrom(
      this.issuesAPIService
        .bulkUpdate(status, orgSlug, [], projectIds, query, start, end, environment)
        .pipe(
          tap((resp) => {
            this.setBulkUpdateComplete(resp.status);
          }),
          catchError((err: HttpErrorResponse) => {
            this.snackbar.open("Error, unable to update issue");
            return EMPTY;
          })
        )
    );
  }

  private setUpdateSelectedIssues(selectedIssues: number[]) {
    this.setState({
      selectedIssues,
      allResultsSelected: false,
    });
  }

  private setSelectAllOnPage() {
    const state = this.state.getValue();
    this.setState({
      selectedIssues: state.issues.map((issue) => issue.id),
    });
  }

  private setCancelAllOnPageSelection() {
    this.setState({
      selectedIssues: [],
      allResultsSelected: false,
    });
  }

  private setAllResultsSelected() {
    this.setState({
      allResultsSelected: true,
    });
  }

  private setCancelAllResultsSelection() {
    this.setState({
      allResultsSelected: false,
    });
  }

  private setIssuesLoading() {
    const state = this.state.getValue();
    this.setState({
      directHit: undefined,
      selectedIssues: [],
      allResultsSelected: false,
      errors: [],
      pagination: { ...state.pagination, loading: true },
    });
  }

  private setUpdateStatusByIssueIdComplete(
    issueIds: number[],
    status: IssueStatus
  ) {
    const state = this.state.getValue();
    this.setState({
      issues: state.issues.map((issue) =>
        issueIds.includes(issue.id) ? { ...issue, status } : issue
      ),
      selectedIssues: [],
    });
  }

  private setBulkUpdateComplete(status: IssueStatus) {
    const state = this.state.getValue();
    this.setState({
      issues: state.issues.map((issue) => {
        return { ...issue, status };
      }),
      selectedIssues: [],
      allResultsSelected: false,
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

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { Issue, IStatus, IssueWithSelected, IssueStatus } from "./interfaces";
import { baseUrl } from "../constants";

interface IssuesState {
  issues: Issue[];
  selectedIssues: number[];
  issueCount: number | null;
  page: number | null;
  nextPage: string | null;
  previousPage: string | null;
}

const initialState: IssuesState = {
  issues: [],
  selectedIssues: [],
  issueCount: null,
  page: null,
  nextPage: null,
  previousPage: null
};

@Injectable({
  providedIn: "root"
})
export class IssuesService {
  private issuesState = new BehaviorSubject<IssuesState>(initialState);
  private getState$ = this.issuesState.asObservable();
  private url = baseUrl + "/issues/";

  issues$ = this.getState$.pipe(map(state => state.issues));
  selectedIssues$ = this.getState$.pipe(map(state => state.selectedIssues));
  issuesWithSelected$: Observable<IssueWithSelected[]> = combineLatest(
    this.issues$,
    this.selectedIssues$,
    (issues, selectedIssues) =>
      issues.map(issue => ({
        ...issue,
        isSelected: selectedIssues.includes(issue.id) ? true : false
      }))
  );
  areAllSelected$ = combineLatest(
    this.issues$,
    this.selectedIssues$,
    (issues, selectedIssues) => issues.length === selectedIssues.length
  );
  issueCount$ = this.getState$.pipe(map(state => state.issueCount));
  hasNextPage$ = this.getState$.pipe(map(state => state.nextPage !== null));
  hasPreviousPage$ = this.getState$.pipe(
    map(state => state.previousPage !== null)
  );

  constructor(private http: HttpClient) {}

  getNextPage() {
    this.retrieveIssues(this.issuesState.getValue().nextPage).toPromise();
  }

  getPreviousPage() {
    this.retrieveIssues(this.issuesState.getValue().previousPage).toPromise();
  }

  retrieveInitialIssues() {
    return this.retrieveIssues(this.url);
  }

  toggleSelected(issueId: number) {
    const state = this.issuesState.getValue();
    let selectedIssues: number[];
    if (state.selectedIssues.includes(issueId)) {
      selectedIssues = state.selectedIssues.filter(issue => issue !== issueId);
    } else {
      selectedIssues = state.selectedIssues.concat([issueId]);
    }
    this.issuesState.next({ ...state, selectedIssues });
  }

  toggleSelectAll() {
    const state = this.issuesState.getValue();
    if (state.issues.length === state.selectedIssues.length) {
      this.issuesState.next({
        ...state,
        selectedIssues: []
      });
    } else {
      this.issuesState.next({
        ...state,
        selectedIssues: state.issues.map(issue => issue.id)
      });
    }
  }

  bulkSetStatus(status: IssueStatus) {
    const selectedIssues = this.issuesState.getValue().selectedIssues;
    return this.updateStatus(selectedIssues, status).toPromise();
  }

  private retrieveIssues(url: string) {
    return this.http
      .get<Issue[]>(url, { observe: "response" })
      .pipe(
        tap(resp => {
          this.setIssues(resp.body);
          this.setPagination(resp.headers.get("link"));
        })
      );
  }

  private updateStatus(ids: number[], status: IssueStatus) {
    const params = {
      id: ids.map(id => id.toString())
    };
    const data = {
      status: status
    };
    return this.http.put(this.url, data, { params }).pipe(
      tap(_ => console.log("updateStatus status: ", _)),
      catchError(err => "error alert")
    );
  }

  private setIssues(issues: Issue[]) {
    this.issuesState.next({ ...this.issuesState.getValue(), issues });
  }

  /**
   * Pagination info exists in a header, parse it out and store it.
   * Anything with an actual link indicates it has results. This differs just
   * very slightly from sentry open source.
   */
  private setPagination(linkHeader: string) {
    let parts: { [key: string]: string } = linkHeader
      .split(",")
      .reduce((acc, link) => {
        let match = link.match(/<(.*)>; rel="(\w*)"/);
        let url = match[1];
        let rel = match[2];
        acc[rel] = url;
        return acc;
      }, {});
    this.issuesState.next({
      ...this.issuesState.getValue(),
      nextPage: parts.next ? parts.next : null,
      previousPage: parts.prev ? parts.prev : null
    });
  }
}

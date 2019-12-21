import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { Issue, IStatus } from "./interfaces";
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

  updateStatus(id: number, status: IStatus) {
    const url = `${this.url}${id}/`;
    console.log("update the following url: ", url, " to ", status);
    return this.http.put<any>(url, status).pipe(
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

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Subject } from "rxjs";
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

  getNextPage = new Subject();
  getPreviousPage = new Subject();
  getFirstPage = new Subject();

  constructor(private http: HttpClient) {}

  retrieveIssues() {
    return this.http
      .get<Issue[]>(this.url)
      .pipe(tap(issues => this.setIssues(issues)));
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
}

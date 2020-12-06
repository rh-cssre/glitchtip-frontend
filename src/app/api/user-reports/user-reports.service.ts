import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { tap, catchError, map } from "rxjs/operators";
import { EMPTY, BehaviorSubject } from "rxjs";
import { baseUrl } from "../../constants";
import { UserReport } from "./user-reports.interfaces";
import { urlParamsToObject } from "src/app/issues/utils";
import { processLinkHeader } from "src/app/shared/utils-pagination";

interface UserReportsState {
  reports: UserReport[] | null;
  nextPage: string | null;
  previousPage: string | null;
  loading: boolean;
  errors: string | null;
}

const initialState: UserReportsState = {
  reports: null,
  nextPage: null,
  previousPage: null,
  loading: false,
  errors: null,
};

@Injectable({
  providedIn: "root",
})
export class UserReportsService {
  private userReportsState = new BehaviorSubject<UserReportsState>(
    initialState
  );
  private getState$ = this.userReportsState.asObservable();
  private readonly issuePageUrl = baseUrl + "/issues/";

  reports$ = this.getState$.pipe(map((state) => state.reports));
  loading$ = this.getState$.pipe(map((state) => state.loading));
  errors$ = this.getState$.pipe(map((state) => state.errors));
  hasNextPage$ = this.getState$.pipe(map((state) => state.nextPage !== null));
  hasPreviousPage$ = this.getState$.pipe(
    map((state) => state.previousPage !== null)
  );
  nextPageParams$ = this.getState$.pipe(
    map((state) => urlParamsToObject(state.nextPage))
  );
  previousPageParams$ = this.getState$.pipe(
    map((state) => urlParamsToObject(state.previousPage))
  );

  constructor(private http: HttpClient) {}

  getReportsForIssue(issue: number, cursor: string | undefined) {
    this.setLoadingReports(true);
    this.resetUserReports();
    this.getIssueReports(issue, cursor)
      .pipe(
        tap((response) => {
          this.setLoadingReports(false);
          this.resetErrorsReports();
          const linkHeader = response.headers.get("link");
          if (response.body && linkHeader) {
            this.setReports(response.body);
            this.setPagination(linkHeader);
          }
        }),
        catchError((error) => {
          this.setLoadingReports(false);
          this.setErrorsReports(
            "Something went wrong. Try reloading the page."
          );
          return EMPTY;
        })
      )
      .subscribe();
  }

  private getIssueReports(issueId: number, cursor: string | undefined) {
    let httpParams = new HttpParams();
    if (cursor) {
      httpParams = httpParams.set("cursor", cursor);
    }
    return this.http.get<UserReport[]>(
      `${this.issuePageUrl}${issueId}/user-reports/`,
      { observe: "response", params: httpParams }
    );
  }

  private setReports(reports: UserReport[]) {
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      reports,
    });
  }

  private setLoadingReports(loading: boolean) {
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      loading,
    });
  }

  private setErrorsReports(message: string) {
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      errors: message,
    });
  }

  private resetUserReports() {
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      reports: initialState.reports,
    });
  }

  private resetErrorsReports() {
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      errors: initialState.errors,
    });
  }

  private setPagination(linkHeader: string) {
    const parts = processLinkHeader(linkHeader);
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      nextPage: parts.next ? parts.next : null,
      previousPage: parts.previous ? parts.previous : null,
    });
  }
}

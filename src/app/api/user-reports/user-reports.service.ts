import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { tap, catchError, map } from "rxjs/operators";
import { EMPTY, BehaviorSubject } from "rxjs";
import { baseUrl } from "../../constants";
import { UserReport } from "./user-reports.interfaces";
import { urlParamsToObject } from "src/app/issues/utils";

interface UserReportsState {
  reports: UserReport[] | null;
  nextPage: string | null;
  previousPage: string | null;
  loading: { reports: boolean };
  errors: { reports: string | null };
}

const initialState: UserReportsState = {
  reports: null,
  nextPage: null,
  previousPage: null,
  loading: { reports: false },
  errors: { reports: null },
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
  loadingReports$ = this.getState$.pipe(map((state) => state.loading.reports));
  errorsReports$ = this.getState$.pipe(map((state) => state.errors.reports));
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
      loading: { reports: loading },
    });
  }

  private setErrorsReports(message: string) {
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      errors: { reports: message },
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

  /**
   * Pagination info exists in a header, parse it out and store it.
   * Anything with an actual link indicates it has results. This differs just
   * very slightly from sentry open source.
   */
  private setPagination(linkHeader: string) {
    const parts = linkHeader
      .split(",")
      .reduce<{ [key: string]: string }>((acc, link) => {
        const match = link.match(/<(.*)>; rel="(\w*)"/);
        if (match) {
          const url = match[1];
          const rel = match[2];
          acc[rel] = url;
          return acc;
        }
        return {};
      }, {});
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      nextPage: parts.next ? parts.next : null,
      previousPage: parts.prev ? parts.prev : null,
    });
  }
}

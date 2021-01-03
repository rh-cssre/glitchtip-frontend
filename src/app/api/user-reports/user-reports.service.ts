import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { tap, catchError, map } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { baseUrl } from "../../constants";
import { UserReport } from "./user-reports.interfaces";
import {
  initialPaginationState,
  PaginationStatefulService,
  PaginationStatefulServiceState,
} from "src/app/shared/stateful-service/pagination-stateful-service";

export interface UserReportsState extends PaginationStatefulServiceState {
  reports: UserReport[] | null;
  errors: string | null;
}

const initialState: UserReportsState = {
  reports: null,
  errors: null,
  pagination: initialPaginationState,
};

@Injectable({
  providedIn: "root",
})
export class UserReportsService extends PaginationStatefulService<UserReportsState> {
  private readonly issuePageUrl = baseUrl + "/issues/";

  reports$ = this.getState$.pipe(map((state) => state.reports));
  errors$ = this.getState$.pipe(map((state) => state.errors));

  constructor(private http: HttpClient) {
    super(initialState);
  }

  getReportsForIssue(issue: number, cursor: string | undefined) {
    this.setLoadingReports(true);
    this.resetUserReports();
    this.getIssueReports(issue, cursor)
      .pipe(
        tap((response) => {
          this.setLoadingReports(false);
          this.resetErrorsReports();
          if (response.body) {
            this.setStateAndPagination({ reports: response.body }, response);
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

  private setLoadingReports(loading: boolean) {
    const state = this.state.getValue();
    this.setState({
      pagination: {
        ...state.pagination,
        loading,
      },
    });
  }

  private setErrorsReports(message: string) {
    this.setState({ errors: message });
  }

  private resetUserReports() {
    this.setState({ reports: initialState.reports });
  }

  private resetErrorsReports() {
    this.setState({ errors: initialState.errors });
  }
}

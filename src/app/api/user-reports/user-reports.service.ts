import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap, catchError, map } from "rxjs/operators";
import { EMPTY, BehaviorSubject } from "rxjs";
import { baseUrl } from "../../constants";
import { UserReport } from "./user-reports.interfaces";

interface UserReportsState {
  reports: UserReport[];
  loading: { reports: boolean };
  errors: { reports: string | null };
}

const initialState: UserReportsState = {
  reports: [],
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

  constructor(private http: HttpClient) {}

  getReportsForIssue(issue: number) {
    this.setLoadingReports(true);
    this.getIssueReports(issue)
      .pipe(
        tap((response) => {
          this.setLoadingReports(false);
          this.resetErrorsReports();
          this.setReports(response);
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

  private getIssueReports(issueId: number) {
    return this.http.get<UserReport[]>(
      `${this.issuePageUrl}${issueId}/user-reports/`
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

  private resetErrorsReports() {
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      errors: initialState.errors,
    });
  }
}

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { tap, catchError, map } from "rxjs/operators";
import { EMPTY, BehaviorSubject } from "rxjs";
import { baseUrl } from "../../constants";
import { UserReport } from "./user-reports.interfaces";

interface UserReportsState {
  reports: UserReport[];
}

const initialState: UserReportsState = {
  reports: [],
};

@Injectable({
  providedIn: "root",
})
export class UserReportsService {
  private userReportsState = new BehaviorSubject<UserReportsState>(
    initialState
  );
  private getState$ = this.userReportsState.asObservable();
  private readonly projectPageUrl = baseUrl + "/organizations/";
  private readonly issuePageUrl = baseUrl + "/issues/";

  reports$ = this.getState$.pipe(map((state) => state.reports));

  constructor(private http: HttpClient) {}

  getReports(orgSlug: string, project: string[] | null) {
    this.getOrganizationReports(orgSlug, project)
      .pipe(
        tap((response) => {
          this.setReports(response);
        }),
        catchError((error) => {
          console.log("error", error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  // /api/0/organizations/:orgSlug/user-reports/?project=1
  getOrganizationReports(orgSlug: string, project?: string[] | null) {
    let params = new HttpParams();
    if (project) {
      project.forEach((id) => {
        params = params.append("project", id);
      });
    }
    return this.http.get<UserReport[]>(
      `${this.projectPageUrl}/${orgSlug}/user-reports/`,
      { params }
    );
  }

  // /api/0/issues/:issueId/user-reports/
  getIssueReports(issueId: number) {
    return this.http.get<UserReport[]>(
      `${this.issuePageUrl}/${issueId}/user-reports/`
    );
  }

  private setReports(reports: UserReport[]) {
    this.userReportsState.next({
      ...this.userReportsState.getValue(),
      reports,
    });
  }
}

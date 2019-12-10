import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { Issue } from "./interfaces";
import { baseUrl } from "../constants";

@Injectable({
  providedIn: "root"
})
export class IssuesService {
  private issues = new BehaviorSubject<Issue[]>([]);
  getIssues = this.issues.asObservable();
  url = baseUrl + "/issues/";

  constructor(private http: HttpClient) {}

  retrieveIssues() {
    return this.http
      .get<Issue[]>(this.url)
      .pipe(tap(issues => this.setIssues(issues)));
  }

  updateIssue(status: string, issueId: string, issue: Issue) {
    const url = `${this.url}${issueId}/`;
    return this.http.put<any>(url, issue);
  }

  setIssues(issues: Issue[]) {
    this.issues.next(issues);
  }
}

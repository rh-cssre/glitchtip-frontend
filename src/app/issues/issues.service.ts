import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Issue, IStatus } from "./interfaces";
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

  updateStatus(id: number, status: IStatus) {
    const url = `${this.url}${id}/`;
    console.log("update the following url: ", url, " to ", status);
    return this.http.put<any>(url, status).pipe(
      tap(_ => console.log("updateStatus status: ", _)),
      catchError(err => "error alert")
    );
  }

  setIssues(issues: Issue[]) {
    this.issues.next(issues);
  }
}

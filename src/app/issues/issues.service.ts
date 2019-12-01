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
  constructor(private http: HttpClient) {}

  retrieveIssues() {
    const url = baseUrl + "/issues/";
    return this.http
      .get<Issue[]>(url)
      .pipe(tap(issues => this.setIssues(issues)));
  }

  setIssues(issues: Issue[]) {
    this.issues.next(issues);
  }
}

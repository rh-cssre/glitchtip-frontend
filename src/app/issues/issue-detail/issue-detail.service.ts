import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import { IssueDetail } from "../interfaces";

interface IssueDetailState {
  issue: IssueDetail | null;
}

const initialState: IssueDetailState = {
  issue: null
};

@Injectable({
  providedIn: "root"
})
export class IssueDetailService {
  private readonly state = new BehaviorSubject<IssueDetailState>(initialState);
  private readonly getState$ = this.state.asObservable();
  private readonly url = baseUrl + "/issues/";
  readonly issue$ = this.getState$.pipe(map(state => state.issue));

  constructor(private http: HttpClient) {}

  retrieveIssue(id: number) {
    return this.http
      .get<IssueDetail>(`${this.url}/${id}`)
      .pipe(tap(issue => this.setIssue(issue)));
  }

  clearState() {
    this.state.next(initialState);
  }

  private setIssue(issue: IssueDetail) {
    this.state.next({ ...this.state.getValue(), issue });
  }
}

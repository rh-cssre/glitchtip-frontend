import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest, EMPTY } from "rxjs";
import { tap, map } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import { IssueDetail, EventDetail, IssueStatus } from "../interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { IssuesService } from "../issues.service";

interface IssueDetailState {
  issue: IssueDetail | null;
  event: EventDetail | null;
  isReversed: boolean;
}

const initialState: IssueDetailState = {
  issue: null,
  event: null,
  isReversed: true
};

@Injectable({
  providedIn: "root"
})
export class IssueDetailService {
  private readonly state = new BehaviorSubject<IssueDetailState>(initialState);
  private readonly getState$ = this.state.asObservable();
  private readonly url = baseUrl + "/issues/";
  readonly issue$ = this.getState$.pipe(map(state => state.issue));
  readonly event$ = this.getState$.pipe(map(state => state.event));
  readonly isReversed$ = this.getState$.pipe(map(state => state.isReversed));
  readonly hasNextEvent$ = this.event$.pipe(
    map(event => event && event.nextEventID !== null)
  );
  readonly hasPreviousEvent$ = this.event$.pipe(
    map(event => event && event.previousEventID !== null)
  );
  readonly nextEventUrl$ = combineLatest(
    this.organization.activeOrganizationSlug$,
    this.issue$,
    this.event$
  ).pipe(
    map(([orgSlug, issue, event]) => {
      if (event && event.nextEventID) {
        return this.eventUrl(orgSlug, issue, event.nextEventID);
      }
      return null;
    })
  );
  readonly previousEventUrl$ = combineLatest(
    this.organization.activeOrganizationSlug$,
    this.issue$,
    this.event$
  ).pipe(
    map(([orgSlug, issue, event]) => {
      if (event && event.previousEventID) {
        return this.eventUrl(orgSlug, issue, event.previousEventID);
      }
      return null;
    })
  );
  readonly reversedFrames$ = combineLatest(this.event$, this.isReversed$).pipe(
    map(([event, isReversed]) => {
      console.log("IS REVERSED", isReversed);
      if (event && isReversed) {
        // for (const entry of event.entries) {
        //   if (entry.type === "exception") {
        //     entry.data.values.forEach(value => {
        //       if (value && value.stacktrace && value.stacktrace.frames) {
        //         value.stacktrace.frames.reverse();
        //       }
        //     });
        //   }
        // }
        // const frames = event.entries[0].data.values[0].stacktrace.frames;
        // frames: frames.reverse();
      }
    })
  );

  constructor(
    private http: HttpClient,
    private organization: OrganizationsService,
    private issueService: IssuesService
  ) {}

  retrieveIssue(id: number) {
    return this.http
      .get<IssueDetail>(`${this.url}${id}/`)
      .pipe(tap(issue => this.setIssue(issue)));
  }

  getPreviousEvent() {
    const state = this.state.getValue();
    if (state.issue && state.event && state.event.previousEventID) {
      this.retrieveEvent(state.issue.id, state.event.previousEventID);
    }
  }

  getNextEvent() {
    const state = this.state.getValue();
    if (state.issue && state.event && state.event.nextEventID) {
      this.retrieveEvent(state.issue.id, state.event.nextEventID);
    }
  }

  getLatestEvent() {
    const issue = this.state.getValue().issue;
    if (issue) {
      return this.retrieveLatestEvent(issue.id);
    }
    return EMPTY;
  }

  getEventByID(eventID: string) {
    const issue = this.state.getValue().issue;
    if (issue) {
      return this.retrieveEvent(issue.id, eventID);
    }
    return EMPTY;
  }

  getReversedFrames() {
    const event = this.state.getValue().event;
    console.log("REVERSED FRAMES", this.state.getValue().isReversed);
    console.log("AND EVENT: ", event);
    if (event) {
      this.toggleIsReversed();
    }
  }

  reverseFrames() {
    const reverse = this.state.getValue().isReversed;
    const event = this.state.getValue().event;
    console.log("REVERSE STATE: ", reverse);
    if (reverse && event) {
      // return event.entries[0].data.values[0].stacktrace.frames;
      // return event.entries[0].data.values[0].stacktrace.frames.reverse();
    }
  }

  setStatus(status: IssueStatus) {
    const issue = this.state.getValue().issue;
    if (issue) {
      return this.issueService
        .setStatus(issue.id, status)
        .pipe(tap(resp => this.setIssueStatus(resp.status)))
        .toPromise();
    }
  }

  /** Set local state issue state */
  private setIssueStatus(status: IssueStatus) {
    const state = this.state.getValue();
    if (state.issue) {
      const issue = { ...state.issue, status };
      this.state.next({ ...state, issue });
    }
  }

  private retrieveLatestEvent(issueId: number) {
    const url = `${this.url}${issueId}/events/latest/`;
    return this.http
      .get<EventDetail>(url)
      .pipe(tap(event => this.setEvent(event)));
  }

  // private removed for testing
  retrieveEvent(issueId: number, eventID: string) {
    const url = `${this.url}${issueId}/events/${eventID}/`;
    return this.http
      .get<EventDetail>(url)
      .pipe(tap(event => this.setEvent(event)));
  }

  clearState() {
    this.state.next(initialState);
  }

  // private removed for testing
  setIssue(issue: IssueDetail) {
    this.state.next({ ...this.state.getValue(), issue });
  }

  // private removed for testing
  setEvent(event: EventDetail) {
    this.state.next({ ...this.state.getValue(), event });
  }

  toggleIsReversed() {
    const isReversed = this.state.getValue().isReversed;
    this.state.next({ ...this.state.getValue(), isReversed: !isReversed });
  }

  /** Build event detail url string */
  private eventUrl(
    orgSlug: string | null,
    issue: IssueDetail | null,
    eventID: string
  ) {
    if (orgSlug && issue) {
      return `/organizations/${orgSlug}/issues/${issue.id}/events/${eventID}`;
    }
    return null;
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest, EMPTY } from "rxjs";
import { tap, map } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import {
  IssueDetail,
  EventDetail,
  IssueStatus,
  Entry,
  ExceptionValueData,
  IRequest,
  AnnotatedRequest,
  CSP,
  Message
} from "../interfaces";
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
  readonly nextEventUrl$ = combineLatest([
    this.organization.activeOrganizationSlug$,
    this.issue$,
    this.event$
  ]).pipe(
    map(([orgSlug, issue, event]) => {
      if (event && event.nextEventID) {
        return this.eventUrl(orgSlug, issue, event.nextEventID);
      }
      return null;
    })
  );
  readonly previousEventUrl$ = combineLatest([
    this.organization.activeOrganizationSlug$,
    this.issue$,
    this.event$
  ]).pipe(
    map(([orgSlug, issue, event]) => {
      if (event && event.previousEventID) {
        return this.eventUrl(orgSlug, issue, event.previousEventID);
      }
      return null;
    })
  );
  readonly eventEntryException$ = combineLatest([
    this.event$,
    this.isReversed$
  ]).pipe(
    map(([event, isReversed]) =>
      event ? this.reverseFrames(event, isReversed) : undefined
    )
  );
  readonly eventEntryRequest$ = this.event$.pipe(
    map(event => (event ? this.entryRequestData(event) : undefined))
  );
  readonly eventEntryCSP$ = this.event$.pipe(
    map(event => (event ? this.eventEntryCSP(event) : undefined))
  );
  readonly eventEntryMessage$ = this.event$.pipe(
    map(event => (event ? this.eventEntryMessage(event) : undefined))
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
    this.toggleIsReversed();
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

  private toggleIsReversed() {
    const isReversed = this.state.getValue().isReversed;
    this.state.next({ ...this.state.getValue(), isReversed: !isReversed });
  }

  /* Return the message entry type for an event */
  private eventEntryMessage(event: EventDetail): Message | undefined {
    const eventEntryMessage = event.entries.find(
      entry => entry.type === "message"
    );
    if (eventEntryMessage) {
      const eventMessage = (eventEntryMessage as Entry<"message", Message>)
        .data;
      return { ...eventMessage };
    }
  }

  /* Return the CSP entry type for an event */
  private eventEntryCSP(event: EventDetail): CSP | undefined {
    const cspEntryType = event.entries.find(entry => entry.type === "csp");
    if (cspEntryType) {
      const eventCSP = (cspEntryType as Entry<"csp", CSP>).data;
      return { ...eventCSP };
    }
  }

  /* Return the request entry type for an event with additional fields parsed from url */
  private entryRequestData(event: EventDetail): AnnotatedRequest | undefined {
    const requestEntryType = event.entries.find(
      entry => entry.type === "request"
    );
    if (requestEntryType) {
      const eventRequest = (requestEntryType as Entry<"request", IRequest>)
        .data;
      const urlDomainName = new URL(eventRequest.url).hostname;
      const urlPath = new URL(eventRequest.url).pathname;
      return { ...eventRequest, domainName: urlDomainName, path: urlPath };
    }
  }

  /* Reverse frame array, nested in the event object */
  private reverseFrames(
    event: EventDetail,
    isReversed: boolean
  ): ExceptionValueData | undefined {
    const exceptionEntryType = event.entries.find(
      entry => entry.type === "exception"
    );
    if (exceptionEntryType) {
      const eventException = (exceptionEntryType as Entry<
        "exception",
        ExceptionValueData
      >).data;
      if (isReversed) {
        const reversedFrames = eventException.values.map(value => {
          const frameReverse = [...value.stacktrace.frames.reverse()];
          return {
            ...value,
            stacktrace: { ...value.stacktrace, frames: [...frameReverse] }
          };
        });
        return {
          ...eventException,
          values: reversedFrames
        };
      } else {
        return { ...eventException };
      }
    }
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

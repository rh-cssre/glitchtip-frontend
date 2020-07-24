import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest, EMPTY } from "rxjs";
import { tap, map } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import {
  IssueDetail,
  EventDetail,
  IssueStatus,
  ExceptionValueData,
  Request,
  AnnotatedRequest,
  CSP,
  Message,
  Values,
  EntryType,
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
  isReversed: true,
};

@Injectable({
  providedIn: "root",
})
export class IssueDetailService {
  private readonly state = new BehaviorSubject<IssueDetailState>(initialState);
  private readonly getState$ = this.state.asObservable();
  private readonly url = baseUrl + "/issues/";
  readonly issue$ = this.getState$.pipe(map((state) => state.issue));
  readonly event$ = this.getState$.pipe(map((state) => state.event));
  readonly isReversed$ = this.getState$.pipe(map((state) => state.isReversed));
  readonly hasNextEvent$ = this.event$.pipe(
    map((event) => event && event.nextEventID !== null)
  );
  readonly hasPreviousEvent$ = this.event$.pipe(
    map((event) => event && event.previousEventID !== null)
  );
  readonly nextEventUrl$ = combineLatest([
    this.organization.activeOrganizationSlug$,
    this.issue$,
    this.event$,
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
    this.event$,
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
    this.isReversed$,
  ]).pipe(
    map(([event, isReversed]) =>
      event ? this.reverseFrames(event, isReversed) : undefined
    )
  );
  readonly rawStacktraceValues$ = this.event$.pipe(
    map((event) => (event ? this.rawStacktraceValues(event) : undefined))
  );
  readonly eventEntryRequest$ = this.event$.pipe(
    map((event) => (event ? this.entryRequestData(event) : undefined))
  );
  readonly eventEntryCSP$ = this.event$.pipe(
    map((event) => (event ? this.eventEntryCSP(event) : undefined))
  );
  readonly eventEntryMessage$ = this.event$.pipe(
    map((event) => (event ? this.eventEntryMessage(event) : undefined))
  );

  constructor(
    private http: HttpClient,
    private organization: OrganizationsService,
    private issueService: IssuesService
  ) {}

  retrieveIssue(id: number) {
    return this.http
      .get<IssueDetail>(`${this.url}${id}/`)
      .pipe(tap((issue) => this.setIssue(issue)));
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
        .pipe(tap((resp) => this.setIssueStatus(resp.status)))
        .toPromise();
    }
    return;
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
      .pipe(tap((event) => this.setEvent(event)));
  }

  // private removed for testing
  retrieveEvent(issueId: number, eventID: string) {
    const url = `${this.url}${issueId}/events/${eventID}/`;
    return this.http
      .get<EventDetail>(url)
      .pipe(tap((event) => this.setEvent(event)));
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
    const eventMessage = this.getMessageEntryData(event);

    if (eventMessage) {
      return { ...eventMessage };
    }
    return;
  }

  /* Return the CSP entry type for an event */
  private eventEntryCSP(event: EventDetail): CSP | undefined {
    const eventCSP = this.getCspEntryData(event);

    if (eventCSP) {
      return { ...eventCSP };
    }
    return;
  }

  /* Return the request entry type for an event with additional fields parsed from url */
  private entryRequestData(event: EventDetail): AnnotatedRequest | undefined {
    const eventRequest = this.getRequestEntryData(event);

    if (eventRequest) {
      let urlDomainName = "";
      let urlPath: string;
      try {
        urlDomainName = new URL(eventRequest.url).hostname;
        urlPath = new URL(eventRequest.url).pathname;
      } catch (_) {
        urlPath = eventRequest.url;
      }
      return { ...eventRequest, domainName: urlDomainName, path: urlPath };
    }
    return;
  }

  /* Reverse frame array, nested in the event object */
  private reverseFrames(
    event: EventDetail,
    isReversed: boolean
  ): ExceptionValueData | undefined {
    const eventException = this.getExceptionEntryData(event);

    if (eventException) {
      if (isReversed) {
        const reversedFrames = eventException.values.map((value) => {
          const frameReverse = [...value.stacktrace.frames].reverse();
          return {
            ...value,
            stacktrace: { ...value.stacktrace, frames: [...frameReverse] },
          };
        });
        return {
          ...eventException,
          values: reversedFrames,
        };
      } else {
        return { ...eventException };
      }
    }
    return;
  }

  rawStacktraceValues(event: EventDetail): Values[] | undefined {
    const platform = event.platform;
    const eventException = this.getExceptionEntryData(event);

    if (eventException) {
      const values = eventException.values.map((value) => {
        if (platform !== "python") {
          const reverseFrames = [...value.stacktrace.frames].reverse();
          return {
            ...value,
            stacktrace: { ...value.stacktrace, frames: reverseFrames },
          };
        } else {
          return { ...value };
        }
      });
      return [...values];
    }
    return;
  }

  /**
   * We had some methods above that looked a bit daunting; one way to make them
   * less daunting was to get the ugly-looking typecasting out of the way.
   *
   * So here are a few helper functions that funnel into getEntryData and return
   * data which is typed the way we want.
   */
  private getExceptionEntryData(event: EventDetail) {
    return this.getEntryData(event, "exception") as
      | ExceptionValueData
      | undefined;
  }

  private getMessageEntryData(event: EventDetail) {
    return this.getEntryData(event, "message") as Message | undefined;
  }

  private getCspEntryData(event: EventDetail) {
    return this.getEntryData(event, "csp") as CSP | undefined;
  }

  private getRequestEntryData(event: EventDetail) {
    return this.getEntryData(event, "request") as Request | undefined;
  }

  /**
   * Regardless of what kind of entry it is, we want to return the `data`
   * property or undefined
   */
  private getEntryData(event: EventDetail, entryType: EntryType) {
    const entries = event.entries.find((entry) => entry.type === entryType);
    if (!entries) {
      return undefined;
    }
    return entries.data;
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

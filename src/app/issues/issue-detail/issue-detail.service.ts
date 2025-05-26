import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY, lastValueFrom } from "rxjs";
import { catchError, filter, take, tap, withLatestFrom } from "rxjs/operators";
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
  AnnotatedContexts,
  BreadcrumbValueData,
  IssueTags,
  IssueTagsAdjusted,
} from "../interfaces";
import { generateIconPath } from "../../shared/shared.utils";
import { IssuesAPIService } from "src/app/api/issues/issues-api.service";
import { Json } from "src/app/interface-primitives";
import { OrganizationsService } from "src/app/api/organizations.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { toObservable } from "@angular/core/rxjs-interop";

interface IssueDetailState {
  issue: IssueDetail | null;
  issueLoading: boolean;
  issueInitialLoadComplete: boolean;
  event: EventDetail | null;
  eventLoading: boolean;
  eventInitialLoadComplete: boolean;
  tags: IssueTags[] | null;
  isReversed: boolean;
  showShowMore: boolean;
}

const initialState: IssueDetailState = {
  issue: null,
  event: null,
  tags: null,
  isReversed: true,
  showShowMore: false,
  issueLoading: false,
  issueInitialLoadComplete: false,
  eventLoading: false,
  eventInitialLoadComplete: false,
};

@Injectable({
  providedIn: "root",
})
export class IssueDetailService extends StatefulService<IssueDetailState> {
  private organization = inject(OrganizationsService);
  private issuesAPIService = inject(IssuesAPIService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  readonly issue = computed(() => this.state().issue);
  readonly issue$ = toObservable(this.issue);
  readonly issueInitialLoadComplete = computed(
    () => this.state().issueInitialLoadComplete,
  );
  readonly issueInitialLoadComplete$ = toObservable(
    this.issueInitialLoadComplete,
  );
  readonly event = computed(() => this.state().event);
  readonly event$ = toObservable(this.event);
  readonly tags = computed(() => {
    const state = this.state();
    return state.tags && this.tagsWithPercent(state.tags);
  });
  readonly eventInitialLoadComplete = computed(
    () => this.state().eventInitialLoadComplete,
  );
  readonly eventInitialLoadComplete$ = toObservable(
    this.eventInitialLoadComplete,
  );
  readonly isReversed = computed(() => this.state().isReversed);
  readonly isReversed$ = toObservable(this.isReversed);
  readonly showShowMore = computed(() => this.state().showShowMore);
  readonly showShowMore$ = toObservable(this.showShowMore);
  readonly hasNextEvent = computed(
    () => this.event() && this.event()?.nextEventID !== null,
  );
  readonly hasNextEvent$ = toObservable(this.hasNextEvent);
  readonly hasPreviousEvent = computed(
    () => this.event() && this.event()?.previousEventID !== null,
  );
  readonly hasPreviousEvent$ = toObservable(this.hasPreviousEvent);
  readonly nextEventUrl = computed(() => {
    const orgSlug = this.organization.activeOrganizationSlug();
    const issue = this.issue();
    const event = this.event();

    if (event && event.nextEventID) {
      return this.eventUrl(orgSlug, issue, event.nextEventID);
    }
    return null;
  });
  readonly nextEventUrl$ = toObservable(this.nextEventUrl);
  readonly previousEventUrl = computed(() => {
    const orgSlug = this.organization.activeOrganizationSlug();
    const issue = this.issue();
    const event = this.event();

    if (event && event.previousEventID) {
      return this.eventUrl(orgSlug, issue, event.previousEventID);
    }
    return null;
  });
  readonly previousEventUrl$ = toObservable(this.previousEventUrl);
  readonly eventEntryException = computed(() => {
    const event = this.event();
    const isReversed = this.isReversed();

    return event ? this.reverseFrames(event, isReversed) : undefined;
  });
  readonly eventEntryException$ = toObservable(this.eventEntryException);
  readonly _rawStacktraceValues = computed(() => {
    const event = this.event();
    return event ? this.rawStacktraceValues(event) : undefined;
  });
  readonly rawStacktraceValues$ = toObservable(this._rawStacktraceValues);
  readonly eventEntryRequest = computed(() => {
    const event = this.event();
    return event ? this.entryRequestData(event) : undefined;
  });
  readonly eventEntryRequest$ = toObservable(this.eventEntryRequest);
  readonly _eventEntryCSP = computed(() => {
    const event = this.event();
    return event ? this.eventEntryCSP(event) : undefined;
  });
  readonly eventEntryCSP$ = toObservable(this._eventEntryCSP);
  readonly _eventEntryMessage = computed(() => {
    const event = this.event();
    return event ? this.eventEntryMessage(event) : undefined;
  });
  readonly eventEntryMessage$ = toObservable(this._eventEntryMessage);
  readonly _specialContexts = computed(() => {
    const event = this.event();
    return event ? this.specialContexts(event) : undefined;
  });
  readonly specialContexts$ = toObservable(this._specialContexts);
  readonly breadcrumbs = computed(() => {
    const event = this.event();
    return event ? this.eventEntryBreadcrumbs(event) : undefined;
  });
  readonly breadcrumbs$ = toObservable(this.breadcrumbs);

  constructor() {
    super(initialState);
  }

  retrieveIssue(id: number) {
    this.setState({ issueLoading: true });
    return this.issuesAPIService.retrieve(id.toString()).pipe(
      tap((issue) => this.setIssue(issue)),
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.clearIssue();
        }
        return EMPTY;
      }),
    );
  }

  getPreviousEvent() {
    const state = this.state();
    if (state.issue && state.event && state.event.previousEventID) {
      this.retrieveEvent(state.issue.id, state.event.previousEventID);
    }
  }

  getNextEvent() {
    const state = this.state();
    if (state.issue && state.event && state.event.nextEventID) {
      this.retrieveEvent(state.issue.id, state.event.nextEventID);
    }
  }

  getLatestEvent() {
    const issue = this.state().issue;
    if (issue) {
      return this.retrieveLatestEvent(issue.id);
    }
    return EMPTY;
  }

  getEventByID(eventID: string) {
    const issue = this.state().issue;
    if (issue) {
      return this.retrieveEvent(issue.id, eventID);
    }
    return EMPTY;
  }

  retrieveTags(id: number, query?: string) {
    return this.issuesAPIService.retrieveTags(id.toString(), query).pipe(
      tap((resp) => {
        this.setTags(resp);
      }),
    );
  }

  getReversedFrames() {
    this.toggleIsReversed();
  }

  setShowShowMore(value: boolean) {
    this.setState({ showShowMore: value });
  }

  setStatus(status: IssueStatus) {
    const issue = this.state().issue;
    if (issue) {
      lastValueFrom(
        this.organization.activeOrganizationSlug$.pipe(
          filter((slug) => !!slug),
          take(1),
          tap((slug) => {
            if (slug) {
              lastValueFrom(
                this.issuesAPIService
                  .update(status, slug, issue.id)
                  .pipe(tap((resp) => this.setIssueStatus(resp.status))),
              );
            }
          }),
        ),
      );
    }
  }

  updateCommentCount(num: number) {
    this.setUpdatedCommentCount(num);
  }

  deleteIssue(id: string) {
    this.issuesAPIService
      .destroy(id)
      .pipe(
        withLatestFrom(this.organization.activeOrganizationSlug$),
        tap(([_, activeOrgSlug]) => {
          this.snackBar.open(`Issue ${id} has been deleted.`);
          this.router.navigate([activeOrgSlug, "issues"]);
        }),
        catchError((_) => {
          this.snackBar.open(
            `There was an error deleting this issue. Please try again.`,
          );
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private tagsWithPercent(tags: IssueTags[]): IssueTagsAdjusted[] | undefined {
    if (tags.length > 0) {
      const tagsWithExtraData = tags.map((tag) => {
        const totalValues = tag.totalValues;
        const limitedTopValues = tag.topValues.slice(0, 10);
        const tagWithPercent = limitedTopValues.map((topValue) => {
          const count = topValue.count;
          const percent = (count / totalValues) * 100;
          const percentRounded = Math.round(percent);
          /** percent is to add up for total percent and percentRounded is for display */
          return {
            ...topValue,
            percentRounded,
            percent,
          };
        });
        const sumOfPercents = tagWithPercent.reduce(
          (accum, item) => accum + item.percent,
          0,
        );
        if (sumOfPercents < 100) {
          return {
            ...tag,
            topValues: tagWithPercent,
            other: Math.round(100 - sumOfPercents),
          };
        } else {
          return { ...tag, topValues: tagWithPercent };
        }
      });

      return [...tagsWithExtraData];
    }
    return;
  }

  /** Set local state issue state */
  private setIssueStatus(status: IssueStatus) {
    const state = this.state();
    if (state.issue) {
      const issue = { ...state.issue, status };
      this.setState({ issue });
    }
  }

  private retrieveLatestEvent(issueId: number) {
    this.setState({ eventLoading: true });
    return this.issuesAPIService.retrieveLatestEvent(issueId).pipe(
      tap((event) => this.setEvent(event)),
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.clearEvent();
        }
        return EMPTY;
      }),
    );
  }

  // private removed for testing
  retrieveEvent(issueId: number, eventID: string) {
    this.setState({ eventLoading: true });
    return this.issuesAPIService.retrieveEvent(issueId, eventID).pipe(
      tap((event) => this.setEvent(event)),
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.clearEvent();
        }
        return EMPTY;
      }),
    );
  }

  // private removed for testing
  setIssue(issue: IssueDetail) {
    this.setState({
      issue,
      issueLoading: false,
      issueInitialLoadComplete: true,
    });
  }

  private clearIssue() {
    this.setState({
      issue: null,
      issueLoading: false,
      issueInitialLoadComplete: true,
      event: null,
    });
  }

  private setUpdatedCommentCount(num: number) {
    const state = this.state();
    if (state.issue) {
      this.setState({
        issue: {
          ...state.issue,
          numComments: state.issue.numComments + num,
        },
      });
    }
  }

  // private removed for testing
  setEvent(event: EventDetail) {
    this.setState({
      event,
      eventLoading: false,
      eventInitialLoadComplete: true,
    });
  }

  clearEvent() {
    this.setState({
      event: null,
      eventLoading: false,
      eventInitialLoadComplete: true,
    });
  }

  setTags(tags: IssueTags[]) {
    this.setState({ tags });
  }

  private toggleIsReversed() {
    const isReversed = this.state().isReversed;
    this.setState({ isReversed: !isReversed });
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

  /* Return the breadcrumbs entry type for an event */
  private eventEntryBreadcrumbs(
    event: EventDetail,
  ): BreadcrumbValueData | undefined {
    const breadcrumbs = this.getBreadcrumbs(event);
    if (breadcrumbs) {
      return { ...breadcrumbs };
    }
    return;
  }

  /* Return the request entry type for an event with additional fields parsed from url */
  private entryRequestData(event: EventDetail): AnnotatedRequest | undefined {
    const eventRequest = this.getRequestEntryData(event);
    if (eventRequest) {
      let urlDomainName = "";
      let urlPath = "";
      try {
        urlDomainName = new URL(eventRequest.url).hostname;
        const path = new URL(eventRequest.url).pathname;
        urlPath = path === "/" ? eventRequest.url : path;
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
    isReversed: boolean,
  ): ExceptionValueData | undefined {
    const eventException = this.getExceptionEntryData(event);

    if (eventException) {
      if (isReversed) {
        const reversedFrames = eventException.values.map((value) => {
          if (value.stacktrace && "frames" in value.stacktrace) {
            const frameReverse = [...value.stacktrace.frames].reverse();
            return {
              ...value,
              stacktrace: { ...value.stacktrace, frames: [...frameReverse] },
            };
          }
          return value;
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
        if (
          platform !== "python" &&
          value.stacktrace &&
          "frames" in value.stacktrace
        ) {
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

  checkContextName(
    contextsObject: { [key: string]: Json },
    defaultUnknown: string,
  ) {
    if (
      contextsObject.name !== "Other" &&
      typeof contextsObject.name === "string"
    ) {
      return contextsObject.name;
    }
    return `Unknown ${defaultUnknown}`;
  }

  /**
   * For the contexts bar in event detail, find specific contexts and
   * return array of matching objects to loop through in template.
   * The order they are return in should always be user, browser, runtime
   * os, device, gpu
   */
  specialContexts(event: EventDetail): AnnotatedContexts[] {
    const user = event.user;
    const contexts = event.contexts;
    const contextsArray: AnnotatedContexts[] = [];

    for (const key in contexts) {
      if (key) {
        const contextsObject = contexts[key];

        if (key === "browser") {
          contextsArray.unshift({
            type: key,
            icon: contextsObject.name
              ? generateIconPath(contextsObject.name as string)
              : null,
            matIcon: "tab",
            title: this.checkContextName(contextsObject, "Browser"),
            subtitle: contextsObject.version
              ? (contextsObject.version as string)
              : "Unknown",
            key: "Version",
          });
        }
        if (key === "runtime") {
          contextsArray.unshift({
            type: key,
            icon: contextsObject.name
              ? generateIconPath(contextsObject.name as string)
              : null,
            matIcon: "tab",
            title: this.checkContextName(contextsObject, "Runtime"),
            subtitle: contextsObject.version
              ? (contextsObject.version as string)
              : "Unknown",
            key: "Version",
          });
        }
        if (key === "os" || key === "client_os") {
          contextsArray.unshift({
            type: key,
            icon: contextsObject.name
              ? generateIconPath(contextsObject.name as string)
              : null,
            matIcon: "computer",
            title: this.checkContextName(contextsObject, "Operating System"),
            subtitle: contextsObject.version
              ? (contextsObject.version as string)
              : contextsObject.kernel_version
                ? (contextsObject.kernel_version as string)
                : "Unknown",
            key: contextsObject.version
              ? "Version"
              : contextsObject.kernel_version
                ? "Kernel"
                : "Version",
          });
        }
        if (key === "device") {
          contextsArray.unshift({
            type: key,
            icon: contextsObject.model
              ? generateIconPath(contextsObject.model as string)
              : null,
            matIcon: "devices_other",
            title: contextsObject.model
              ? (contextsObject.model as string)
              : "Unknown Device",
            subtitle: contextsObject.arch
              ? (contextsObject.arch as string)
              : contextsObject.model_id
                ? (contextsObject.model_id as string)
                : null,
            key: contextsObject.arch
              ? "Arch"
              : contextsObject.model_id
                ? "Model"
                : null,
          });
        }
        if (key === "gpu") {
          contextsArray.unshift({
            type: key,
            icon: contextsObject.name
              ? generateIconPath(contextsObject.name as string)
              : null,
            matIcon: "memory",
            title: this.checkContextName(contextsObject, "GPU"),
            subtitle: contextsObject.vendor_name
              ? (contextsObject.vendor_name as string)
              : "Unknown",
            key: "Vendor",
          });
        }
      }
    }

    if (user) {
      let userTitle = user.email
        ? user.email
        : user.ip_address || user.id || user.username;
      if (!userTitle) {
        userTitle = "Unknown User";
      }
      let newKey = "";
      let newSubtitle = "";
      if (user.id && user.id !== userTitle) {
        newKey = "ID";
        newSubtitle = user.id;
      } else if (user.username && user.username !== userTitle) {
        newKey = "Username";
        newSubtitle = user.username;
      }
      contextsArray.unshift({
        type: "user",
        icon: null,
        matIcon: "account_circle",
        title: userTitle,
        subtitle: newSubtitle,
        key: newKey,
      });
    }

    return contextsArray;
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

  private getBreadcrumbs(event: EventDetail) {
    return this.getEntryData(event, "breadcrumbs") as
      | BreadcrumbValueData
      | undefined;
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
    eventID: string,
  ) {
    if (orgSlug && issue) {
      return `/${orgSlug}/issues/${issue.id}/events/${eventID}`;
    }
    return null;
  }
}

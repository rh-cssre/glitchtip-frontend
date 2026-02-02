import { Injectable, computed, inject, resource, signal } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
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
import { Json } from "src/app/interface-primitives";
import { OrganizationsService } from "src/app/api/organizations.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { client } from "src/app/shared/api/api";
import { components } from "src/app/api/api-schema";

type EventDetail = components["schemas"]["IssueEventDetailSchema"];
type IssueDetail = components["schemas"]["IssueDetailSchema"];

interface IssueDetailState {
  tags: IssueTags[] | null;
  isReversed: boolean;
  showShowMore: boolean;
}

const initialState: IssueDetailState = {
  tags: null,
  isReversed: true,
  showShowMore: false,
};

@Injectable({
  providedIn: "root",
})
export class IssueDetailService extends StatefulService<IssueDetailState> {
  private organization = inject(OrganizationsService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  readonly issue = computed(() => this.#issueResource.value());
  readonly issueInitialLoadComplete = computed(() =>
    this.#issueResource.hasValue(),
  );
  readonly event = computed(() => this.#eventResource.value());
  readonly tags = computed(() => {
    const state = this.state();
    return state.tags && this.tagsWithPercent(state.tags);
  });
  readonly eventInitialLoadComplete = computed(() =>
    this.#eventResource.hasValue(),
  );
  readonly isReversed = computed(() => this.state().isReversed);
  readonly showShowMore = computed(() => this.state().showShowMore);
  readonly hasNextEvent = computed(
    () => this.event() && this.event()?.nextEventID !== null,
  );
  readonly hasPreviousEvent = computed(
    () => this.event() && this.event()?.previousEventID !== null,
  );
  readonly nextEventUrl = computed(() => {
    const orgSlug = this.organization.activeOrganizationSlug();
    const issue = this.issue();
    const event = this.event();

    if (event && event.nextEventID) {
      return this.eventUrl(orgSlug, issue!, event.nextEventID);
    }
    return null;
  });
  readonly previousEventUrl = computed(() => {
    const orgSlug = this.organization.activeOrganizationSlug();
    const issue = this.issue();
    const event = this.event();

    if (event && event.previousEventID) {
      return this.eventUrl(orgSlug, issue!, event.previousEventID);
    }
    return null;
  });
  readonly eventEntryException = computed(() => {
    const event = this.event();
    const isReversed = this.isReversed();

    return event ? this.reverseFrames(event, isReversed) : undefined;
  });
  readonly rawStacktraceValues = computed(() => {
    const event = this.event();
    return event ? this.getRawStacktraceValues(event) : undefined;
  });
  readonly eventEntryRequest = computed(() => {
    const event = this.event();
    return event ? this.getEntryRequestData(event) : undefined;
  });
  readonly eventEntryCSP = computed(() => {
    const event = this.event();
    return event ? this.getEventEntryCSP(event) : undefined;
  });
  readonly eventEntryMessage = computed(() => {
    const event = this.event();
    return event ? this.getEventEntryMessage(event) : undefined;
  });
  readonly specialContexts = computed(() => {
    const event = this.event();
    return event ? this.getSpecialContexts(event) : undefined;
  });
  readonly breadcrumbs = computed(() => {
    const event = this.event();
    return event ? this.eventEntryBreadcrumbs(event) : undefined;
  });

  issueID = signal("");
  eventID = signal<string | null>(null);
  #issueResource = resource({
    params: () => ({ issueID: this.issueID() }),
    loader: async ({ params }) => {
      if (!params.issueID) {
        return;
      }
      const { data } = await client.GET("/api/0/issues/{issue_id}/", {
        params: { path: { issue_id: parseInt(params.issueID) } },
      });
      return data;
    },
  });
  #eventResource = resource({
    params: () => ({ issueID: this.issueID(), eventID: this.eventID() }),
    loader: async ({ params }) => {
      const issueID = parseInt(params.issueID);
      const eventID = params.eventID;
      if (!issueID) {
        return undefined;
      }
      if (eventID) {
        const { data } = await client.GET(
          "/api/0/issues/{issue_id}/events/{event_id}/",
          {
            params: {
              path: { issue_id: issueID, event_id: eventID },
            },
          },
        );
        return data;
      }
      const { data } = await client.GET(
        "/api/0/issues/{issue_id}/events/latest/",
        {
          params: { path: { issue_id: issueID } },
        },
      );
      return data;
    },
  });

  constructor() {
    super(initialState);
  }

  async retrieveTags(id: number, query?: string) {
    const queryParams: any = query ? { query: query } : {};
    const { data } = await client.GET("/api/0/issues/{issue_id}/tags/", {
      params: { path: { issue_id: id }, query: queryParams },
    });
    if (data) {
      this.setTags(data as any);
    }
  }

  getReversedFrames() {
    this.toggleIsReversed();
  }

  setShowShowMore(value: boolean) {
    this.setState({ showShowMore: value });
  }

  async setStatus(status: IssueStatus) {
    const issue = this.issue();
    if (issue) {
      const { data } = await client.PUT(
        "/api/0/organizations/{organization_slug}/issues/{issue_id}/",
        {
          params: {
            path: {
              organization_slug: this.organization.activeOrganizationSlug(),
              issue_id: parseInt(this.issueID()),
            },
          },
          body: { status: status as any },
        },
      );
      if (data) {
        this.setIssueStatus(data.status as IssueStatus);
      }
    }
  }

  updateCommentCount(num: number) {
    this.setUpdatedCommentCount(num);
  }

  async deleteIssue(id: string) {
    const { error } = await client.DELETE("/api/0/issues/{issue_id}/", {
      params: { path: { issue_id: parseInt(id) } },
    });
    if (error) {
      this.snackBar.open(
        `There was an error deleting this issue. Please try again.`,
      );
    } else {
      this.snackBar.open($localize`Issue ${id} has been deleted.`);
      this.router.navigate([
        this.organization.activeOrganizationSlug(),
        "issues",
      ]);
    }
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
    this.#issueResource.update((issue) => ({ ...issue!, status }));
  }

  private setUpdatedCommentCount(num: number) {
    this.#issueResource.update((issue) => ({
      ...issue!,
      numComments: issue!.numComments + num,
    }));
  }

  setTags(tags: IssueTags[]) {
    this.setState({ tags });
  }

  private toggleIsReversed() {
    const isReversed = this.state().isReversed;
    this.setState({ isReversed: !isReversed });
  }

  /* Return the message entry type for an event */
  private getEventEntryMessage(event: EventDetail): Message | undefined {
    const eventMessage = this.getMessageEntryData(event);

    if (eventMessage) {
      return { ...eventMessage };
    }
    return;
  }

  /* Return the CSP entry type for an event */
  private getEventEntryCSP(event: EventDetail): CSP | undefined {
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
  private getEntryRequestData(
    event: EventDetail,
  ): AnnotatedRequest | undefined {
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

  getRawStacktraceValues(event: EventDetail): Values[] | undefined {
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
  getSpecialContexts(event: EventDetail): AnnotatedContexts[] {
    const user: any = event.user;
    const contexts = event.contexts;
    const contextsArray: AnnotatedContexts[] = [];

    for (const key in contexts) {
      if (key) {
        const contextsObject: any = contexts[key];

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
    const entries = event.entries!.find((entry) => entry.type === entryType);
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

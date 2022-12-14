// tslint:disable:no-any
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MICRO_SENTRY_CONFIG, MicroSentryService } from "@micro-sentry/angular";
import { EMPTY } from "rxjs";
import { take } from "rxjs/operators";
import { IssueDetailService } from "./issue-detail.service";
import { IssueDetail, EventDetail, AnnotatedContexts } from "../interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { sampleIssueDetail } from "./issue-detail-test-data";
import { databaseError } from "./event-detail/test-data/database-error";
import { RouterTestingModule } from "@angular/router/testing";
import { zeroDivisionDotnet } from "./event-detail/test-data/zero-division-dotnet";
import { breadcrumbError } from "./event-detail/test-data/breadcrumb-error";

describe("IssueDetailService", () => {
  let httpTestingController: HttpTestingController;
  let service: IssueDetailService;
  let mockOrgService: OrganizationsService;

  beforeEach(() => {
    mockOrgService = jasmine.createSpyObj(["retrieveIssue"]);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: OrganizationsService, useValue: mockOrgService },
        MicroSentryService,
        { provide: MICRO_SENTRY_CONFIG, useValue: {} },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(IssueDetailService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retieve issue detail", () => {
    const testData: IssueDetail = sampleIssueDetail;
    service.retrieveIssue(testData.id).toPromise();
    const req = httpTestingController.expectOne(
      `/api/0/issues/${testData.id}/`
    );
    req.flush(testData);
    service.issue$.subscribe((issue) => expect(issue).toEqual(testData));
  });

  it("should clear the issue state", () => {
    const testData: any = sampleIssueDetail;
    let issue: IssueDetail | null = null;

    service.issue$.subscribe((issueFromSubscription) => {
      issue = issueFromSubscription;
    });

    service.setIssue(testData);
    expect(issue).toEqual(testData);
    service.clearState();
    expect(issue).toEqual(null);
  });

  it("getEventById should return an empty observable when issue state is null", () => {
    const eventID = "a58902b72e3e45f58ab9ecfb08297fd1";
    expect(service.getEventByID(eventID)).toBe(EMPTY);
  });

  it("getEventById should call retrieveEvent when issue state is not null", () => {
    const eventID = "a58902b72e3e45f58ab9ecfb08297fd1";
    const testData = sampleIssueDetail;
    let issue: any = null;
    spyOn(service, "retrieveEvent");

    service.issue$.subscribe((subIssue) => {
      issue = subIssue;
    });

    service.setIssue(testData);
    expect(issue).toBeTruthy();
    service.getEventByID(eventID);
    expect(issue).toBe(testData);
    expect(service.retrieveEvent).toHaveBeenCalled();
  });

  it("eventEntryException$ selector flips frames array", () => {
    const testData: any = databaseError;
    let lineNo: any;

    service.setEvent(testData);
    service.eventEntryException$
      .pipe(take(3))
      .subscribe((entryException: any) => {
        lineNo = entryException.values[0].stacktrace.frames[0].lineNo;
      });
    expect(lineNo).toEqual(415);
    service.getReversedFrames();
    expect(lineNo).toEqual(34);
  });

  it("rawStacktraceValues$ selector flips frames array if the event platform is not python", () => {
    const testData: any = zeroDivisionDotnet;

    service.setEvent(testData);
    service.rawStacktraceValues$.subscribe((values: any) => {
      expect(values[0].stacktrace.frames[0].lineNo).toEqual(14);
    });
  });

  it("request$ selector returns the request entry type object without mutating event state", () => {
    const testData: EventDetail = databaseError;
    service.setEvent(testData);

    service.eventEntryRequest$
      .pipe(take(1))
      .subscribe((eventEntryRequest: any) => {
        expect(eventEntryRequest.path).toEqual("/database-error/");
        expect(eventEntryRequest.domainName).toEqual("localhost");
      });

    /* checks that changing the testData for eventEntryRequest$ does not mutate event data */
    service.event$.pipe(take(1)).subscribe((event: any) => {
      expect(event).toBe(testData);
    });
  });

  it("return an array of contexts objects", () => {
    const testData: EventDetail = databaseError;
    const result: AnnotatedContexts[] = [
      {
        title: "em@jay.com",
        subtitle: "117",
        key: "ID",
        icon: null,
        matIcon: "account_circle",
        type: "user",
      },
      {
        title: "Firefox",
        subtitle: "72.0",
        key: "Version",
        icon: "static/assets/images/browser-svgs/firefox/firefox.svg",
        matIcon: "tab",
        type: "browser",
      },
      {
        title: "Linux",
        subtitle: "Unknown",
        key: "Version",
        icon: "static/assets/images/os-logos/LIN.png",
        matIcon: "computer",
        type: "os",
      },
      {
        title: "CPython",
        subtitle: "3.8.0",
        key: "Version",
        icon: "static/assets/images/logos/48x48/python.svg",
        matIcon: "tab",
        type: "runtime",
      },
    ];
    service.setEvent(testData);

    service.specialContexts$
      .pipe(take(1))
      .subscribe((contexts: AnnotatedContexts[] | undefined) => {
        expect(contexts).toEqual(result);
      });
  });

  it("makes unknown contexts easier to understand", () => {
    const incomingContexts: any = {
      os: {
        name: "Other",
      },
      trace: {
        op: "django.middleware",
        span_id: "redacted",
        trace_id: "redacted",
        description: "redacted",
        parent_span_id: "redacted",
      },
      device: {
        family: "Other",
      },
      browser: {
        name: "Other",
      },
      runtime: {
        name: "CPython",
        build: "3.8.6 redacted",
        version: "3.8.6",
      },
    };

    const transformedContexts: any = [
      {
        type: "user",
        icon: null,
        matIcon: "account_circle",
        title: "em@jay.com",
        subtitle: "117",
        key: "ID",
      },
      {
        type: "runtime",
        icon: "static/assets/images/logos/48x48/python.svg",
        matIcon: "tab",
        title: "CPython",
        subtitle: "3.8.6",
        key: "Version",
      },
      {
        type: "browser",
        icon: undefined,
        matIcon: "tab",
        title: "Unknown Browser",
        subtitle: "Unknown",
        key: "Version",
      },
      {
        type: "device",
        icon: null,
        matIcon: "devices_other",
        title: "Unknown Device",
        subtitle: null,
        key: null,
      },
      {
        type: "os",
        icon: undefined,
        matIcon: "computer",
        title: "Unknown Operating System",
        subtitle: "Unknown",
        key: "Version",
      },
    ];

    /** replace contexts object with real-life problem-data */
    const testData: EventDetail = {
      ...databaseError,
      contexts: incomingContexts,
    };

    service.setEvent(testData);

    service.specialContexts$
      .pipe(take(1))
      .subscribe((contexts: AnnotatedContexts[] | undefined) => {
        expect(contexts).toEqual(transformedContexts);
      });
  });

  it("breadcrumbs should come through with no changes", () => {
    const testData: any = breadcrumbError;

    service.setEvent(testData);
    service.breadcrumbs$.subscribe((breadcrumb: any) => {
      expect(breadcrumb.values[0].timestamp).toEqual(
        "2020-12-18T18:09:47.841276Z"
      );
    });
  });
});

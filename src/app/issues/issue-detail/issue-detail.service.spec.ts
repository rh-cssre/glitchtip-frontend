import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { EMPTY } from "rxjs";
import { take } from "rxjs/operators";
import { IssueDetailService } from "./issue-detail.service";
import { IssueDetail, EventDetail } from "../interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { sampleIssueDetail } from "./issue-detail-test-data";
import { databaseError } from "./event-detail/test-data/database-error";
import { RouterTestingModule } from "@angular/router/testing";
import { zeroDivisionDotnet } from "./event-detail/test-data/zero-division-dotnet";
import { MatomoModule } from "ngx-matomo";

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
        MatomoModule,
      ],
      providers: [{ provide: OrganizationsService, useValue: mockOrgService }],
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
});

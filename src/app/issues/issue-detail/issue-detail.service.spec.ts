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
import { postErrorWithDataString } from "./event-detail/test-data/post-error";

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

  it("eventEntryException$ selector flips frames array without mutating event state", () => {
    const testData: any = databaseError;
    let fileName = "";

    service.setEvent(testData);

    service.eventEntryException$
      .pipe(take(2))
      .subscribe((entryException: any) => {
        fileName = entryException.values[0].stacktrace.frames[0].filename;
      });

    expect(fileName).toBe("django/db/models/query.py");
    service.getReversedFrames();
    expect(fileName).toBe("django/core/handlers/exception.py");
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
  it("request$ selector returns the request entry type object without mutating event state", () => {
    const testData: EventDetail = postErrorWithDataString;
    service.setEvent(testData);

    service.eventEntryRequest$
      .pipe(take(1))
      .subscribe((eventEntryRequest: any) => {
        expect(typeof eventEntryRequest.data).toBe("object");
      });
  });
});

import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { IssueDetailService } from "./issue-detail.service";
import {
  IssueDetail,
  EventDetail,
  IEntryStreamfieldBlock,
  ExceptionValueData
} from "../interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { sampleIssueDetail } from "./issue-detail-test-data";
import { EMPTY } from "rxjs";
import { latestEvent } from "./event-detail/event-latest-test-data";
import { MatSnackBarModule } from "@angular/material";

describe("IssueDetailService", () => {
  let httpTestingController: HttpTestingController;
  let service: IssueDetailService;
  let mockOrgService: OrganizationsService;

  beforeEach(() => {
    mockOrgService = jasmine.createSpyObj(["retrieveIssue"]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [{ provide: OrganizationsService, useValue: mockOrgService }]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(IssueDetailService);
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
    service.issue$.subscribe(issue => expect(issue).toEqual(testData));
  });

  it("should clear the issue state", () => {
    const testData: any = sampleIssueDetail;
    let issue: IssueDetail | null = null;

    service.issue$.subscribe(issueFromSubscription => {
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

    service.issue$.subscribe(subIssue => {
      issue = subIssue;
    });

    service.setIssue(testData);
    expect(issue).toBeTruthy();
    service.getEventByID(eventID);
    expect(issue).toBe(testData);
    expect(service.retrieveEvent).toHaveBeenCalled();
  });

  it("reversedFrames$ selector flips frames array in event object without mutating event state", () => {
    const testData: EventDetail = latestEvent;
    const testDataFramesFilenameFirstIndex =
      "/polyfills.5f194581390fcad97fb1.js";
    const testDataFramesFilenameLastIndex = "/main.0aa02efa52a79a1f9c59.js";

    service.setEvent(testData);

    // Event state doesn't change
    service.event$.subscribe(event => {
      if (event) {
        const exceptionEntryType = event.entries.find(
          entry => entry.type === "exception"
        );
        const firstFrameFilename = (exceptionEntryType as IEntryStreamfieldBlock<
          "exception",
          ExceptionValueData
        >).data.values[0].stacktrace.frames[0].filename;
        expect(firstFrameFilename).toEqual(testDataFramesFilenameFirstIndex);
      }
    });

    // Reversed frames flips the frames array
    service.reversedFrames$.subscribe(event => {
      if (event) {
        const exceptionEntryType = event.entries.find(
          entry => entry.type === "exception"
        );
        const firstFrameFilename = (exceptionEntryType as IEntryStreamfieldBlock<
          "exception",
          ExceptionValueData
        >).data.values[0].stacktrace.frames[0].filename;
        expect(firstFrameFilename).toEqual(testDataFramesFilenameLastIndex);
      }
    });
  });
});

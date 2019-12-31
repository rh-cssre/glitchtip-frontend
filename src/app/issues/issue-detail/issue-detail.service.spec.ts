import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { IssueDetailService } from "./issue-detail.service";
import { IssueDetail } from "../interfaces";
import { sampleIssue } from "../issue-list-item/sample-data";

describe("IssueDetailService", () => {
  let httpTestingController: HttpTestingController;
  let service: IssueDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(IssueDetailService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retieve issue detail", () => {
    const testData: IssueDetail = sampleIssue;
    service.retrieveIssue(testData.id).toPromise();
    const req = httpTestingController.expectOne(
      `/api/0/issues/${testData.id}/`
    );
    req.flush(testData);
    service.issue$.subscribe(issue => expect(issue).toEqual(testData));
  });
});

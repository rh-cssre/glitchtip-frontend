import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

import { IssuesService } from "./issues.service";
import { Issue } from "./interfaces";
import { issueList } from "./issue-test-data";

describe("IssuesService", () => {
  let httpTestingController: HttpTestingController;
  let service: IssuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(IssuesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retrieve a list of issues", () => {
    const testData: Issue[] = issueList;
    const url = "/api/0/issues/";
    service.retrieveIssues(url).toPromise();
    const req = httpTestingController.expectOne(url);
    req.flush(testData, { headers: { Link: "link header info" } });
    service.issues$.subscribe(issues => expect(issues).toEqual(testData));
  });
});

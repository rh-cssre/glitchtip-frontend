// tslint:disable:no-any
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";

import { IssuesService } from "./issues.service";
import { Issue } from "./interfaces";
import { issueList } from "./issues-page/issues-test-data";
import { RouterTestingModule } from "@angular/router/testing";

describe("IssuesService", () => {
  let httpTestingController: HttpTestingController;
  let service: IssuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(IssuesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retrieve a list of issues", () => {
    const testData: Issue[] = issueList;
    const url = "burke-software-consulting";
    (service as any).retrieveIssues(url).toPromise();
    const req = httpTestingController.expectOne(
      "/api/0/organizations/burke-software-consulting/issues/"
    );
    req.flush(testData, { headers: { Link: "link header info" } });
    service.issues$.subscribe((issues) => expect(issues).toEqual(testData));
  });
});

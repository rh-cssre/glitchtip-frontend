// tslint:disable:no-any
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { provideRouter } from "@angular/router";

import { IssuesService } from "./issues.service";
import { apiIssueList, issueList } from "./issues-page/issues-test-data";
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
      providers: [IssuesService, provideRouter([])],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(IssuesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should retrieve a list of issues", () => {
    const testData = apiIssueList;
    const url = "burke-software-consulting";
    (service as any).retrieveIssues(url).toPromise();
    const req = httpTestingController.expectOne(
      "/api/0/organizations/burke-software-consulting/issues/",
    );
    req.flush(testData, { headers: { Link: "link header info" } });
    service.issues$.subscribe((issues) => expect(issues).toEqual(issueList));
  });

  describe("toggleSelectOne", () => {
    it("should select an issue", () => {
      service.toggleSelectOne("1");
      expect(service.selectedIssues()).toEqual(["1"]);
    });

    it("should deselect an already selected issue", () => {
      service.toggleSelectOne("1");
      service.toggleSelectOne("1");
      expect(service.selectedIssues()).toEqual([]);
    });

    it("should select multiple issues individually", () => {
      service.toggleSelectOne("1");
      service.toggleSelectOne("3");
      expect(service.selectedIssues()).toEqual(["1", "3"]);
    });
  });

  describe("selectRange", () => {
    it("should select all issues in the given range", () => {
      service.selectRange(["1", "2", "3"]);
      expect(service.selectedIssues()).toEqual(["1", "2", "3"]);
    });

    it("should merge range with existing selection without duplicates", () => {
      service.toggleSelectOne("1");
      service.toggleSelectOne("5");
      service.selectRange(["2", "3", "4"]);
      expect(service.selectedIssues()).toEqual(["1", "5", "2", "3", "4"]);
    });

    it("should not create duplicates when range overlaps existing selection", () => {
      service.toggleSelectOne("2");
      service.toggleSelectOne("3");
      service.selectRange(["1", "2", "3", "4"]);
      const selected = service.selectedIssues();
      expect(selected).toContain("1");
      expect(selected).toContain("2");
      expect(selected).toContain("3");
      expect(selected).toContain("4");
      expect(selected.length).toBe(4);
    });

    it("should clear allResultsSelected when selecting a range", () => {
      service.selectAllResults();
      expect(service.allResultsSelected()).toBe(true);
      service.selectRange(["1", "2"]);
      expect(service.allResultsSelected()).toBe(false);
    });
  });

  describe("deselectRange", () => {
    it("should deselect all issues in the given range", () => {
      service.selectRange(["1", "2", "3", "4", "5"]);
      service.deselectRange(["2", "3", "4"]);
      expect(service.selectedIssues()).toEqual(["1", "5"]);
    });

    it("should leave unrelated selections intact", () => {
      service.toggleSelectOne("1");
      service.toggleSelectOne("5");
      service.deselectRange(["3", "4"]);
      expect(service.selectedIssues()).toEqual(["1", "5"]);
    });

    it("should handle deselecting when none in range are selected", () => {
      service.deselectRange(["1", "2", "3"]);
      expect(service.selectedIssues()).toEqual([]);
    });
  });
});

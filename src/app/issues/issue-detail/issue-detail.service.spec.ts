import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { IssueDetailService } from "./issue-detail.service";

describe("IssueDetailService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
  );

  it("should be created", () => {
    const service: IssueDetailService = TestBed.get(IssueDetailService);
    expect(service).toBeTruthy();
  });
});

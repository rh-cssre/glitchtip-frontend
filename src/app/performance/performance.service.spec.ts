import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { PerformanceService } from "./performance.service";

describe("PerformanceService", () => {
  let service: PerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(PerformanceService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

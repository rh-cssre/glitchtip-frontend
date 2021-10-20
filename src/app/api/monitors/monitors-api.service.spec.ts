import { TestBed } from "@angular/core/testing";

import { MonitorsAPIService } from "./monitors-api.service";

describe("MonitorsApiService", () => {
  let service: MonitorsAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorsAPIService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

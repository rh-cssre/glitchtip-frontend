import { TestBed } from "@angular/core/testing";

import { MonitorsApiService } from "./monitors-api.service";

describe("MonitorsApiService", () => {
  let service: MonitorsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorsApiService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

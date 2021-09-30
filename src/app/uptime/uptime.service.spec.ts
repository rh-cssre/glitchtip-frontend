import { TestBed } from "@angular/core/testing";

import { UptimeService } from "./uptime.service";

describe("UptimeService", () => {
  let service: UptimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UptimeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

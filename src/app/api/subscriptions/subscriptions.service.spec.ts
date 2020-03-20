import { TestBed } from "@angular/core/testing";

import { SubscriptionsService } from "./subscriptions.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("SubscriptionsService", () => {
  let service: SubscriptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SubscriptionsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

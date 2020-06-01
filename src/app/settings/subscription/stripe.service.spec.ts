import { TestBed } from "@angular/core/testing";

import { StripeService } from "./stripe.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatomoModule } from "ngx-matomo";

describe("StripeService", () => {
  let service: StripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatomoModule],
    });
    service = TestBed.inject(StripeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

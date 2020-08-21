import { TestBed } from "@angular/core/testing";

import { AuthTokensService } from "./auth-tokens.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("AuthTokensService", () => {
  let service: AuthTokensService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthTokensService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

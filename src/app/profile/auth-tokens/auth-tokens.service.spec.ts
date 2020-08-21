import { TestBed } from "@angular/core/testing";

import { AuthTokensService } from "./auth-tokens.service";

describe("AuthTokensService", () => {
  let service: AuthTokensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthTokensService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

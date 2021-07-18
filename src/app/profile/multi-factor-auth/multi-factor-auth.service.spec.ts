import { TestBed } from "@angular/core/testing";

import { MultiFactorAuthService } from "./multi-factor-auth.service";

describe("MultiFactorAuthService", () => {
  let service: MultiFactorAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiFactorAuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

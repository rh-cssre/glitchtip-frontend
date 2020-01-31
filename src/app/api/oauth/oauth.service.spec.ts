import { TestBed } from "@angular/core/testing";

import { GlitchTipOAuthService } from "./oauth.service";

describe("OauthService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GlitchTipOAuthService = TestBed.get(GlitchTipOAuthService);
    expect(service).toBeTruthy();
  });
});

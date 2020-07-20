import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { GlitchTipOAuthService } from "./oauth.service";

describe("OauthService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
    })
  );

  it("should be created", () => {
    const service: GlitchTipOAuthService = TestBed.inject(
      GlitchTipOAuthService
    );
    expect(service).toBeTruthy();
  });
});

import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { OAuthModule } from "angular-oauth2-oidc";

import { GlitchTipOAuthService } from "./oauth.service";

describe("OauthService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        OAuthModule.forRoot()
      ]
    })
  );

  it("should be created", () => {
    const service: GlitchTipOAuthService = TestBed.get(GlitchTipOAuthService);
    expect(service).toBeTruthy();
  });
});

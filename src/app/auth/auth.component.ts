import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { GlitchTipOAuthService } from "../api/oauth/oauth.service";
import { AuthService } from "../api/auth/auth.service";
import { LoginResponse } from "../api/auth/auth.interfaces";
import { LoginService } from "../login/login.service";

@Component({
  selector: "gt-auth",
  templateUrl: "./auth.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  provider$ = this.route.params.pipe(map((params) => params.provider));
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private oauthService: GlitchTipOAuthService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private loginService: LoginService
  ) {
    authService.isLoggedIn.subscribe(
      (isLoggedIn) => (this.isLoggedIn = isLoggedIn)
    );
  }

  ngOnInit(): void {
    const provider: string | undefined = this.route.snapshot.params.provider;
    const fragment = this.route.snapshot.fragment!;
    const query = this.route.snapshot.queryParamMap;
    if (provider) {
      this.attemptOAuthLogin(provider, fragment, query);
    } else {
      this.notEnoughQueryData();
    }
  }

  private attemptOAuthLogin(
    provider: string,
    fragment: string,
    query: ParamMap
  ) {
    // Various services return tokens in slightly different ways
    const accessToken = new URLSearchParams(fragment).get("access_token");
    const code = query.get("code");

    // keycloak: verify nonce
    if (provider === "keycloak" && !AuthComponent.verifyKeycloakNonce(accessToken)) {
      this.router.navigate([]).then();
      this.snackbar.open("Invalid authentication response, please try again.");
      return;
    }

    if (accessToken || code) {
      this.oauthService
        .completeOAuthLogin(provider, this.isLoggedIn, accessToken, code)
        .pipe(
          tap((resp) => this.loginSuccess(resp)),
          catchError((error: HttpErrorResponse) => {
            this.processSocialAuthErrorResponse(error);
            return EMPTY;
          })
        )
        .toPromise();
    } else {
      this.notEnoughQueryData();
    }
  }

  private static verifyKeycloakNonce(accessToken: string | null):boolean {
    if (!accessToken) {
      document.cookie = "keycloak_nonce=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return false;
    }

    const [_, payload] = accessToken.split('.');

    const {nonce} = JSON.parse(atob(payload));

    // document.cookie = "cookie1=value; cookie2=value; cookie3=value;"
    const cookieNonce = document.cookie.split(";")
      .filter(cookie => cookie.indexOf('=') !== -1)
      .map(cookie => cookie.trim().split("="))
      .filter(([name]) => name === 'keycloak_nonce')?.[0][1];

    if (nonce !== cookieNonce) {
      document.cookie = "keycloak_nonce=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return false;
    }

    document.cookie = "keycloak_nonce=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return true;
  }

  private processSocialAuthErrorResponse(error: HttpErrorResponse) {
    if (error.status === 400) {
      if (error.error?.non_field_errors) {
        this.router.navigate([""]);
        this.snackbar.open(error.error.non_field_errors[0]);
      }
    } else if (error.status === 500) {
      this.router.navigate([""]);
      this.snackbar.open(
        "There was an error connecting to your social authentication provider."
      );
    }
  }

  /** Not enough data to even try auth...just navigate home */
  private notEnoughQueryData() {
    this.router.navigate([]);
  }

  /** On success for any oauth client, set auth data and redirect to home */
  private loginSuccess(response: LoginResponse | null) {
    if (this.isLoggedIn) {
      this.router.navigate(["profile"]);
    } else {
      if (response?.requires_mfa) {
        this.loginService.promptForMFA(response.valid_auth);
        this.router.navigate(["/login"]);
      } else {
        this.authService.afterLogin();
      }
    }
  }
}

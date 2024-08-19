import { Injectable, computed } from "@angular/core";
import { catchError, of, tap, throwError } from "rxjs";
import { APIState } from "../shared/shared.interfaces";
import { AuthService } from "../auth.service";
import {
  AllAuthError,
  AllAuthHttpErrorResponse,
  AllAuthLoginNotAuthResponse,
  AuthFlow,
} from "../api/allauth/allauth.interfaces";
import {
  messagesLookup,
  reduceParamErrors,
} from "../api/allauth/errorMessages";
import { handleAllAuthErrorResponse } from "../api/allauth/allauth.utils";
import { StatefulService } from "../shared/stateful-service/signal-state.service";
import { ActivatedRoute, Router } from "@angular/router";

export interface LoginState extends APIState {
  errors: AllAuthError[];
  validAuth: null;
  rememberRequest: boolean;
  authFlows: AuthFlow[] | null;
  preferTOTP: boolean; // User selected totp/recovery over webauthn
}

const initialState: LoginState = {
  loading: false,
  errors: [],
  validAuth: null,
  rememberRequest: false,
  authFlows: null,
  preferTOTP: false,
};

@Injectable({
  providedIn: "root",
})
export class LoginService extends StatefulService<LoginState> {
  mfaAuthenticate = computed(() => {
    let authMfaFlows = this.authService.mfaFlows();
    const authFlows = this.state().authFlows;

    if (authFlows) {
      authMfaFlows = authMfaFlows.concat(authFlows);
    }
    return authMfaFlows.find((authFlow) => authFlow.id === "mfa_authenticate");
  });
  hasWebAuthn = computed(
    () => this.mfaAuthenticate()?.types?.includes("webauthn") || false,
  );
  requiresMfa = computed(() => !!this.mfaAuthenticate());
  preferTOTP = computed(() => this.state().preferTOTP && this.hasWebAuthn());
  loading = computed(() => this.state().loading);
  formErrors = computed(() =>
    messagesLookup(
      this.state().errors.filter(
        (err) => err.code === "email_password_mismatch" || !err.param,
      ),
    ),
  );
  fieldErrors = computed(() =>
    reduceParamErrors(
      this.state().errors.filter(
        (err) => err.param && err.code !== "email_password_mismatch",
      ),
    ),
  );

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(initialState);
  }

  reset() {
    this.state.set(initialState);
  }

  /** User initiated request to bail on MFA */
  restartLogin() {
    this.setState({ authFlows: null });
    this.authService.restartLogin();
  }

  login(email: string, password: string) {
    this.setState({ loading: true, errors: [] });
    return this.authService.login(email, password).pipe(
      tap(() => this.state.set(initialState)),
      tap((resp) => {
        if (resp.meta.is_authenticated) {
          this.redirect();
        }
      }),
      catchError((err: AllAuthHttpErrorResponse) => {
        if (err.status === 401) {
          // Valid login, but not yet authenticated
          const resp = err.error as AllAuthLoginNotAuthResponse;
          this.setState({ loading: false, authFlows: resp.data.flows });
          return of(undefined);
        } else {
          this.setState({
            loading: false,
            errors: handleAllAuthErrorResponse(err),
          });
          if ([400, 500].includes(err.status)) {
            return of(undefined);
          }
          return throwError(() => err);
        }
      }),
    );
  }

  redirect() {
    const nextUrl = this.route.snapshot.queryParamMap.get("next");
    if (nextUrl) {
      if (nextUrl.startsWith("/admin/")) {
        // Load Django, not JS router
        window.location.href = nextUrl;
      } else {
        this.router.navigateByUrl(nextUrl);
      }
    } else {
      this.router.navigate(["/"]);
    }
  }

  socialLogin(provider: string, callbackUrl = "/") {
    this.setState({ loading: true, errors: [] });
    this.authService.providerRedirect(provider, callbackUrl, "login");
  }

  switchMethod() {
    this.state.update((state) => ({ ...state, preferTOTP: !state.preferTOTP }));
  }

  webAuthnAuthenticate() {
    return this.authService.webAuthnAuthenticate().pipe(
      tap((resp) => {
        if (resp.meta.is_authenticated) {
          this.redirect();
        }
      }),
    );
  }

  totpAuthenticate(code: string) {
    return this.authService.mfaAuthenticate(code).pipe(
      tap((resp) => {
        if (resp.meta.is_authenticated) {
          this.redirect();
        }
      }),
    );
  }
}

import { Injectable, WritableSignal, effect, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import {
  EMPTY,
  catchError,
  combineLatest,
  exhaustMap,
  filter,
  lastValueFrom,
  map,
  of,
  tap,
  throwError,
} from "rxjs";
import {
  get,
  parseRequestOptionsFromJSON,
} from "@github/webauthn-json/browser-ponyfill";
import { AuthenticationService } from "./api/allauth/authentication.service";
import {
  AllAuthLoginNotAuthResponse,
  AuthFlow,
} from "./api/allauth/allauth.interfaces";
import { toObservable } from "@angular/core/rxjs-interop";

const initialIsAuthenticated = localStorage.getItem("isAuthenticated");

@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly isAuthenticated = signal(initialIsAuthenticated === "true");
  readonly initialized = signal(false);
  readonly mfaFlows: WritableSignal<AuthFlow[]> = signal([]);
  /**
   * Emit isAuthenticated immediately when true or else after initialized is set
   * This ensures social auth checks are done during login without delaying logged in users
   */
  loggedInGuard$ = combineLatest([
    toObservable(this.isAuthenticated),
    toObservable(this.initialized),
  ]).pipe(
    filter(([isLoggedIn, initialized]) => isLoggedIn || initialized),
    map(([isLoggedIn]) => isLoggedIn),
  );

  constructor(private authenticationService: AuthenticationService) {
    effect(() => {
      localStorage.setItem(
        "isAuthenticated",
        this.isAuthenticated().toString(),
      );
    });
  }

  checkServerAuthStatus() {
    return this.authenticationService.getAuthenticationStatus().pipe(
      tap((resp) => {
        this.isAuthenticated.set(resp.meta.is_authenticated);
        this.initialized.set(true);
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.isAuthenticated.set(false);
          const resp = err.error as AllAuthLoginNotAuthResponse;
          if (resp.data.flows.find((flow) => flow.id === "mfa_authenticate")) {
            this.mfaFlows.set(resp.data.flows);
          }
          this.initialized.set(true);
          return of(err);
        }
        this.initialized.set(true);
        return throwError(() => new Error("Unable to check auth status"));
      }),
    );
  }

  login(email: string, password: string) {
    return this.authenticationService
      .login(email, password)
      .pipe(
        tap((resp) => this.isAuthenticated.set(resp.meta.is_authenticated)),
      );
  }

  expireAuth() {
    this.isAuthenticated.set(false);
  }

  restartLogin() {
    lastValueFrom(this.authenticationService.logout());
    this.mfaFlows.set([]);
  }

  mfaAuthenticate(code: string) {
    return this.authenticationService
      .mfaAuthenticate(code)
      .pipe(
        tap((resp) => this.isAuthenticated.set(resp.meta.is_authenticated)),
      );
  }

  webAuthnAuthenticate() {
    return this.authenticationService.getWebAuthnCredentialRequest().pipe(
      exhaustMap(async (resp) => {
        return await get(
          parseRequestOptionsFromJSON(resp.data.request_options),
        );
      }),
      exhaustMap((credential) => {
        return this.authenticationService.perform2FAWebAuthn(credential);
      }),
      tap((resp) => this.isAuthenticated.set(resp.meta.is_authenticated)),
    );
  }

  signup(email: string, password: string) {
    return this.authenticationService
      .signup(email, password)
      .pipe(
        tap((resp) => this.isAuthenticated.set(resp.meta.is_authenticated)),
      );
  }

  providerRedirect(
    provider: string,
    callbackUrl: string,
    process: "login" | "connect",
  ) {
    this.authenticationService.providerRedirect(provider, callbackUrl, process);
  }

  logout() {
    return this.authenticationService.logout().pipe(
      catchError((err: HttpErrorResponse) => {
        this.isAuthenticated.set(false);
        this.mfaFlows.set([]);
        if (err.status === 401) {
          return of(EMPTY);
        }
        return throwError(() => new Error("Unable to log out"));
      }),
    );
  }
}

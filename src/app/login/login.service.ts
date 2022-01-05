import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EMPTY } from "rxjs";
import { catchError, map, tap, exhaustMap } from "rxjs/operators";
import { encode, decode } from "cborg";
import { StatefulService } from "../shared/stateful-service/stateful-service";
import { ServerError } from "../shared/django.interfaces";
import { AuthService } from "../api/auth/auth.service";
import { LoginResponse, ValidAuth } from "../api/auth/auth.interfaces";

const baseUrl = "/rest-auth";

interface LoginState {
  loading: boolean;
  error: ServerError | null;
  validAuth: ValidAuth[] | null;
  useTOTP: boolean;
  authInProg: boolean;
}

const initialState: LoginState = {
  loading: false,
  error: null,
  validAuth: null,
  useTOTP: false,
  authInProg: false,
};

@Injectable({
  providedIn: "root",
})
export class LoginService extends StatefulService<LoginState> {
  loading$ = this.getState$.pipe(map((state) => state.loading));
  error$ = this.getState$.pipe(map((state) => state.error));
  requiresMFA$ = this.getState$.pipe(map((state) => !!state.validAuth));
  hasFIDO2$ = this.getState$.pipe(
    map((state) => state.validAuth?.includes("FIDO2"))
  );
  hasTOTP$ = this.getState$.pipe(
    map((state) => state.validAuth?.includes("TOTP"))
  );
  authInProg$ = this.getState$.pipe(map((state) => state.authInProg));
  useTOTP$ = this.getState$.pipe(map((state) => state.useTOTP));
  constructor(private http: HttpClient, private authService: AuthService) {
    super(initialState);
  }

  login(email: string, password: string) {
    const url = baseUrl + "/login/";
    const data = {
      email,
      password,
    };
    this.setState({ loading: true, error: null });
    return this.http.post<LoginResponse | null>(url, data).pipe(
      tap((resp) => {
        if (resp?.requires_mfa) {
          this.promptForMFA(resp.valid_auth);
        } else {
          this.authService.afterLogin();
        }
      }),
      catchError((err) => {
        let error: ServerError | null = null;
        if (err.status === 400) {
          error = err.error;
        } else {
          error = { non_field_errors: ["Error"] };
        }
        this.setState({ loading: false, error });
        return EMPTY;
      })
    );
  }

  promptForMFA(validAuth: ValidAuth[]) {
    this.setState({ validAuth, loading: false, error: null });
  }

  switchMethod() {
    const currentVal = this.state.value.useTOTP;
    this.setState({ useTOTP: !currentVal, error: null });
  }

  authenticateFIDO2() {
    const url = "/api/mfa/authenticate/fido2/";
    this.setState({ loading: true, error: null, authInProg: true });
    return this.http
      .get(url, {
        headers: {
          Accept: "application/octet-stream",
        },
        responseType: "arraybuffer",
      })
      .pipe(
        map((response) => {
          const converted = new Uint8Array(response);
          return decode(converted);
        }),
        exhaustMap(async (options) => {
          const credResult = await navigator.credentials.get(options);
          if (credResult == null) {
            throw Error;
          } else {
            return credResult as PublicKeyCredential;
          }
        }),
        map((resp) => {
          if (resp === undefined) {
            throw Error;
          } else {
            const assertionResponse =
              resp.response as AuthenticatorAssertionResponse;
            return encode({
              credentialId: new Uint8Array(resp.rawId),
              authenticatorData: new Uint8Array(
                assertionResponse.authenticatorData
              ),
              clientDataJSON: new Uint8Array(assertionResponse.clientDataJSON),
              signature: new Uint8Array(assertionResponse.signature),
            });
          }
        }),
        exhaustMap((body) => {
          if (body === undefined) {
            throw Error;
          } else {
            return this.http.post(url, body.buffer, {
              headers: {
                "content-type": "application/cbor",
              },
            });
          }
        }),
        tap(() => {
          this.clearState();
          this.authService.afterLogin();
        }),
        catchError((err) => {
          let error: ServerError | null = null;
          if (this.state.value.useTOTP === false) {
            if (err.status === 400) {
              error = { non_field_errors: err.error };
            } else {
              error = {
                non_field_errors: [
                  "Security key authentication was unsuccessful.",
                ],
              };
            }
            this.setState({ loading: false, error, authInProg: false });
          }
          return EMPTY;
        })
      );
  }

  authenticateTOTP(code: string) {
    const url = "/api/mfa/authenticate/totp/";
    const data = {
      otp: code,
    };
    this.setState({ loading: true, error: null });
    return this.http.post(url, data).pipe(
      tap(() => {
        this.clearState();
        this.authService.afterLogin();
      }),
      catchError((err) => {
        let error: ServerError | null = null;
        if (err.status === 400) {
          error = { non_field_errors: err.error };
        } else {
          error = { non_field_errors: ["Error"] };
        }
        this.setState({ loading: false, error });
        return EMPTY;
      })
    );
  }

  authenticateBackupCode(code: string) {
    const url = "/api/mfa/authenticate/backup_codes/";
    const data = {
      code,
    };
    this.setState({ loading: true, error: null });
    return this.http.post(url, data).pipe(
      tap(() => {
        this.clearState();
        this.authService.afterLogin();
      }),
      catchError((err) => {
        let error: ServerError | null = null;
        if (err.status === 400) {
          if (err.error.code) {
            error = err.error;
          } else {
            error = { non_field_errors: err.error };
          }
        } else {
          error = { non_field_errors: ["Error"] };
        }
        this.setState({ loading: false, error });
        return EMPTY;
      })
    );
  }
}

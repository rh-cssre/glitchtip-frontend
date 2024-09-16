import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { allauthBase } from "src/app/constants";
import {
  AllAuthGetEmailVerificationResponse,
  AllAuthResponse,
  AllAuthSessionResponse,
  GetWebAuthnCredentialRequestResponse,
} from "./allauth.interfaces";
import { catchError, Observable, of, throwError } from "rxjs";
import { JsonObject } from "src/app/interface-primitives";
import { AuthenticationPublicKeyCredential } from "@github/webauthn-json/dist/types/browser-ponyfill";

const baseUrl = allauthBase + "/auth";

function postForm(action: string, data: JsonObject) {
  const f = document.createElement("form");
  f.method = "POST";
  f.action = action;

  for (const key in data) {
    const d = document.createElement("input");
    d.type = "hidden";
    d.name = key;
    d.value = data[key]?.toString()!;
    f.appendChild(d);
  }
  document.body.appendChild(f);
  f.submit();
}

function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
export function getCSRFToken() {
  return getCookie("csrftoken");
}

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  getAuthenticationStatus() {
    return this.http.get<AllAuthSessionResponse>(baseUrl + "/session");
  }

  logout() {
    return this.http.delete<AllAuthSessionResponse>(baseUrl + "/session");
  }

  login(email: string, password: string) {
    return this.http.post<AllAuthSessionResponse>(baseUrl + "/login", {
      email,
      password,
    });
  }

  mfaAuthenticate(code: string) {
    return this.http.post<AllAuthSessionResponse>(
      baseUrl + "/2fa/authenticate",
      { code },
    );
  }

  signup(email: string, password: string) {
    return this.http.post<AllAuthSessionResponse>(baseUrl + "/signup", {
      email,
      password,
    });
  }

  getEmailVerificationInformation(key: string) {
    return this.http.get<AllAuthGetEmailVerificationResponse>(
      baseUrl + "/email/verify",
      {
        headers: {
          "X-Email-Verification-Key": key,
        },
      },
    );
  }

  verifyEmail(key: string) {
    return this.http.post<AllAuthSessionResponse>(baseUrl + "/email/verify", {
      key,
    });
  }

  reauthenticate(password: string) {
    return this.http.post<AllAuthSessionResponse>(baseUrl + "/reauthenticate", {
      password,
    });
  }

  requestPassword(email: string) {
    return this.http.post<AllAuthResponse>(baseUrl + "/password/request", {
      email,
    });
  }

  resetPassword(
    key: string,
    password: string,
  ): Observable<AllAuthSessionResponse> {
    return this.http
      .post<AllAuthSessionResponse>(baseUrl + "/password/reset", {
        key,
        password,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // 401 is the normal response when ACCOUNT_LOGIN_ON_PASSWORD_RESET is false
          if (error.status === 401) {
            return of(error.error);
          }
          return throwError(() => error);
        }),
      );
  }

  providerRedirect(
    provider: string,
    callbackUrl = "/",
    process: "login" | "connect" = "login",
  ) {
    postForm(baseUrl + "/provider/redirect", {
      provider,
      process,
      callback_url: callbackUrl,
      csrfmiddlewaretoken: getCSRFToken(),
    });
  }

  getWebAuthnCredentialRequest() {
    return this.http.get<GetWebAuthnCredentialRequestResponse>(
      baseUrl + "/webauthn/authenticate",
    );
  }

  perform2FAWebAuthn(credential: AuthenticationPublicKeyCredential) {
    return this.http.post<AllAuthSessionResponse>(
      baseUrl + "/webauthn/authenticate",
      { credential },
    );
  }
}

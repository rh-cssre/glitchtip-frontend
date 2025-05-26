import { Injectable } from "@angular/core";
import { allauthBase } from "src/app/constants";
import { JsonObject } from "src/app/interface-primitives";
import { getCSRFToken } from "src/app/shared/shared.utils";
import { client } from "../api";

import { components } from "../allauth-schema";

type AuthenticateWebAuthn = components["schemas"]["WebAuthnCredential"];

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

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  getAuthenticationStatus() {
    return client.GET("/_allauth/browser/v1/auth/session", {
      params: { path: { client: "browser" } },
    });
  }

  logout() {
    return client.DELETE("/_allauth/browser/v1/auth/session", {
      params: { path: { client: "browser" } },
    });
  }

  login(email: string, password: string) {
    return client.POST("/_allauth/browser/v1/auth/login", {
      params: { path: { client: "browser" } },
      body: {
        email,
        password,
      },
    });
  }

  mfaAuthenticate(code: string) {
    return client.POST("/_allauth/browser/v1/auth/2fa/authenticate", {
      params: { path: { client: "browser" } },
      body: {
        code,
      },
    });
  }

  signup(email: string, password: string) {
    return client.POST("/_allauth/browser/v1/auth/signup", {
      params: { path: { client: "browser" } },
      body: {
        email,
        password,
      },
    });
  }

  getEmailVerificationInformation(key: string) {
    return client.GET("/_allauth/browser/v1/auth/email/verify", {
      params: {
        path: { client: "browser" },
        header: {
          "X-Email-Verification-Key": key,
        },
      },
    });
  }

  verifyEmail(key: string) {
    return client.POST("/_allauth/browser/v1/auth/email/verify", {
      params: { path: { client: "browser" } },
      body: {
        key,
      },
    });
  }

  reauthenticate(password: string) {
    return client.POST("/_allauth/browser/v1/auth/reauthenticate", {
      params: { path: { client: "browser" } },
      body: {
        password,
      },
    });
  }

  requestPassword(email: string) {
    return client.POST("/_allauth/browser/v1/auth/password/request", {
      params: { path: { client: "browser" } },
      body: {
        email,
      },
    });
  }

  resetPassword(key: string, password: string) {
    return client.POST("/_allauth/browser/v1/auth/password/reset", {
      params: { path: { client: "browser" } },
      body: {
        key,
        password,
      },
    });
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
    return client.GET("/_allauth/browser/v1/auth/webauthn/authenticate", {
      params: { path: { client: "browser" } },
    });
  }

  perform2FAWebAuthn(credential: AuthenticateWebAuthn) {
    return client.POST("/_allauth/browser/v1/auth/webauthn/authenticate", {
      params: { path: { client: "browser" } },
      body: {
        credential,
      },
    });
  }
}

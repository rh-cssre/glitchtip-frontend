import { Injectable } from "@angular/core";
import { allauthBase } from "src/app/constants";
import { JsonObject } from "src/app/interface-primitives";
import { getCSRFToken } from "src/app/shared/shared.utils";
import { client } from "../../shared/api/api";

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
    return client.GET("/_allauth/browser/v1/auth/session");
  }

  logout() {
    return client.DELETE("/_allauth/browser/v1/auth/session");
  }

  login(email: string, password: string) {
    return client.POST("/_allauth/browser/v1/auth/login", {
      body: {
        email,
        password,
      },
    });
  }

  mfaAuthenticate(code: string) {
    return client.POST("/_allauth/browser/v1/auth/2fa/authenticate", {
      body: {
        code,
      },
    });
  }

  signup(email: string, password: string) {
    return client.POST("/_allauth/browser/v1/auth/signup", {
      body: {
        email,
        password,
      },
    });
  }

  getEmailVerificationInformation(key: string) {
    return client.GET("/_allauth/browser/v1/auth/email/verify", {
      params: {
        header: {
          "X-Email-Verification-Key": key,
        },
      },
    });
  }

  verifyEmail(key: string) {
    return client.POST("/_allauth/browser/v1/auth/email/verify", {
      body: {
        key,
      },
    });
  }

  reauthenticate(password: string) {
    return client.POST("/_allauth/browser/v1/auth/reauthenticate", {
      body: {
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
    return client.GET("/_allauth/browser/v1/auth/webauthn/authenticate");
  }

  perform2FAWebAuthn(credential: AuthenticateWebAuthn) {
    return client.POST("/_allauth/browser/v1/auth/webauthn/authenticate", {
      body: {
        credential,
      },
    });
  }
}

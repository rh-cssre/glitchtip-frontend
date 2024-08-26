import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { allauthBase } from "src/app/constants";
import {
  AllAuthProvidersResponse,
  AllAuthResponse,
  AllAuthSessionResponse,
  AuthenticatorTOTPStatusResponse,
  AuthenticatorsResponse,
  GetWebauthnResponse,
  RegenerateRecoveryCodesResponse,
  WebAuthnAuthenticatorResponse,
} from "./allauth.interfaces";

const baseUrl = allauthBase + "/account";

interface RecoveryCodes {
  codes: string[];
}

@Injectable({
  providedIn: "root",
})
export class AccountService {
  constructor(private http: HttpClient) {}

  changePassword(current_password: string, new_password: string) {
    return this.http.post<AllAuthSessionResponse>(
      baseUrl + "/password/change",
      {
        current_password,
        new_password,
      },
    );
  }

  getProviders() {
    return this.http.get<AllAuthProvidersResponse>(baseUrl + "/providers");
  }

  disconnectProvider(provider: string, account: string) {
    return this.http.delete<AllAuthProvidersResponse>(baseUrl + "/providers", {
      body: {
        provider,
        account,
      },
    });
  }

  listAuthenticators() {
    return this.http.get<AuthenticatorsResponse>(baseUrl + "/authenticators");
  }

  listRecoveryCodes() {
    return this.http.get(baseUrl + "/authenticators/recovery-codes");
  }

  regenerateRecoveryCodes() {
    return this.http.post<RegenerateRecoveryCodesResponse>(
      baseUrl + "/authenticators/recovery-codes",
      null,
    );
  }

  totpAuthenticatorStatus() {
    return this.http.get<AuthenticatorTOTPStatusResponse>(
      baseUrl + "/authenticators/totp",
    );
  }

  activateTOTP(code: string) {
    return this.http.post<AuthenticatorTOTPStatusResponse>(
      baseUrl + "/authenticators/totp",
      { code },
    );
  }

  deactivateTOTP() {
    return this.http.delete<AllAuthResponse>(baseUrl + "/authenticators/totp");
  }

  generateRecoveryCodes() {
    return this.http.get<RecoveryCodes>("/api/0/generate-recovery-codes/");
  }

  setRecoveryCodes(code: string) {
    return this.http.post("/api/0/generate-recovery-codes/", { code });
  }

  getWebAuthn() {
    return this.http.get<GetWebauthnResponse>(
      baseUrl + "/authenticators/webauthn",
    );
  }

  addWebAuthn(name: string, credential: any) {
    return this.http.post<WebAuthnAuthenticatorResponse>(
      baseUrl + "/authenticators/webauthn",
      {
        name,
        credential,
      },
    );
  }

  deleteWebAuthn(ids: number[]) {
    return this.http.delete<AllAuthResponse>(
      baseUrl + "/authenticators/webauthn",
      {
        body: { authenticators: ids },
      },
    );
  }

  renameWebAuthn(id: number, name: string) {
    return this.http.put<WebAuthnAuthenticatorResponse>(
      baseUrl + "/authenticators/webauthn",
      { id, name },
    );
  }
}

import { Injectable, effect, signal, inject, computed } from "@angular/core";
import {
  get,
  parseRequestOptionsFromJSON,
} from "@github/webauthn-json/browser-ponyfill";
import { AuthenticationService } from "./api/allauth/authentication.service";
import { AuthFlow } from "./api/allauth/allauth.interfaces";

const initialIsAuthenticated = localStorage.getItem("isAuthenticated");

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authenticationService = inject(AuthenticationService);

  readonly isAuthenticated = signal(initialIsAuthenticated === "true");
  readonly initialized = signal(false);
  readonly mfaFlows = signal<AuthFlow[]>([]);
  /**
   * Emit isAuthenticated immediately when true or else after initialized is set
   * This ensures social auth checks are done during login without delaying logged in users
   */
  loggedInGuard = computed(() => {
    const isLoggedIn = this.isAuthenticated();
    const initialized = this.initialized();
    if (isLoggedIn || initialized) {
      return isLoggedIn;
    }
    return false;
  });

  constructor() {
    effect(() => {
      localStorage.setItem(
        "isAuthenticated",
        this.isAuthenticated().toString(),
      );
    });
  }

  async checkServerAuthStatus() {
    const { data, error } =
      await this.authenticationService.getAuthenticationStatus();
    if (data) {
      this.isAuthenticated.set(data.meta.is_authenticated);
      this.initialized.set(true);
    }
    if (error) {
      if (error.status === 401) {
        this.isAuthenticated.set(false);
        if (error.data.flows.find((flow) => flow.id === "mfa_authenticate")) {
          this.mfaFlows.set(error.data.flows);
        }
        this.initialized.set(true);
      } else {
        this.initialized.set(true);
        throw new Error("Unable to check auth status");
      }
    }
  }

  async login(email: string, password: string) {
    const resp = await this.authenticationService.login(email, password);
    if (resp.data) {
      this.isAuthenticated.set(resp.data.meta.is_authenticated);
    }
    return resp;
  }

  expireAuth() {
    this.isAuthenticated.set(false);
  }

  restartLogin() {
    this.authenticationService.logout();
    this.mfaFlows.set([]);
  }

  async mfaAuthenticate(code: string) {
    const response = await this.authenticationService.mfaAuthenticate(code);
    if (response.data) {
      this.isAuthenticated.set(response.data.meta.is_authenticated);
    }
    return response;
  }

  async webAuthnAuthenticate() {
    const { data } =
      await this.authenticationService.getWebAuthnCredentialRequest();
    if (data) {
      const parseResult = await get(
        parseRequestOptionsFromJSON(data.data.request_options),
      );
      const webAuthnResult =
        await this.authenticationService.perform2FAWebAuthn(parseResult as any);
      if (webAuthnResult.data) {
        this.isAuthenticated.set(webAuthnResult.data.meta.is_authenticated);
      }
      return webAuthnResult;
    }
    return;
  }

  async signup(email: string, password: string) {
    const response = await this.authenticationService.signup(email, password);
    if (response.data) {
      this.isAuthenticated.set(response.data.meta.is_authenticated);
    }
    return response;
  }

  providerRedirect(
    provider: string,
    callbackUrl: string,
    process: "login" | "connect",
  ) {
    this.authenticationService.providerRedirect(provider, callbackUrl, process);
  }

  async logout() {
    const { error } = await this.authenticationService.logout();
    if (error) {
      this.isAuthenticated.set(false);
      this.mfaFlows.set([]);
      if (error.status === 401) {
        return;
      }
      throw new Error("Unable to log out");
    }
  }
}

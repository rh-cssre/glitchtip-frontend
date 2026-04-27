import { Injectable, computed } from "@angular/core";
import {
  RegistrationPublicKeyCredential,
  create,
  parseCreationOptionsFromJSON,
} from "@github/webauthn-json/browser-ponyfill";
import {
  AllAuthError,
  AuthenticatorTOTPStatusNotFound,
  TOTPAuthenticator,
  WebAuthnAuthenticator,
} from "src/app/api/allauth/allauth.interfaces";
import { handleAllAuthErrorResponse } from "src/app/api/allauth/allauth.utils";
import {
  messagesLookup,
  reduceParamErrors,
} from "src/app/api/allauth/errorMessages";
import { client } from "src/app/shared/api/api";
import { apiResource } from "src/app/shared/api/api-resource-factory";
import { APIState } from "src/app/shared/shared.interfaces";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

export interface MFAState extends APIState {
  setupTOTPStage: number;
  recoveryCodes: string[];
  regenCodes: boolean;
  error: string | null; // Simplistic error, not from allauth
  errors: AllAuthError[];
  copiedCodes: boolean;
  totp: {
    secret: string;
    totpUrl: string;
  } | null;
  webAuthnStage: number;
  credential: RegistrationPublicKeyCredential | null;
}

const initialState: MFAState = {
  loading: false,
  setupTOTPStage: 1,
  recoveryCodes: [],
  regenCodes: false,
  error: null,
  errors: [],
  copiedCodes: false,
  totp: null,
  webAuthnStage: 1,
  credential: null,
};

@Injectable({
  providedIn: "root",
})
export class MultiFactorAuthService extends StatefulService<MFAState> {
  #authenticatorsResource = apiResource(() => ({
    url: "/_allauth/browser/v1/account/authenticators",
  }));
  authenticators = computed(
    () => this.#authenticatorsResource.value()?.data || [],
  );
  initialLoadComplete = computed(
    () =>
      this.#authenticatorsResource.hasValue() ||
      !this.#authenticatorsResource.isLoading(),
  );
  loading = computed(() => this.state().loading);
  setupTOTPStage = computed(() => this.state().setupTOTPStage);
  error = computed(() => this.state().error);
  formErrors = computed(() =>
    messagesLookup(this.state().errors.filter((err) => !err.param)),
  );
  fieldErrors = computed(() =>
    reduceParamErrors(this.state().errors.filter((err) => err.param)),
  );
  copiedCodes = computed(() => this.state().copiedCodes);
  totp = computed(() => this.state().totp);
  TOTPAuthenticator = computed(
    () =>
      this.authenticators().filter((auth) => auth.type === "totp")[0] as
        | TOTPAuthenticator
        | undefined,
  );
  webAuthnAuthenticators = computed(
    () =>
      this.authenticators().filter(
        (auth) => auth.type === "webauthn",
      ) as WebAuthnAuthenticator[],
  );
  codes = computed(() => this.state().recoveryCodes);
  regenCodes = computed(() => this.state().regenCodes);
  webAuthnState = computed(() => this.state().webAuthnStage);

  constructor() {
    super(initialState);
  }

  getAuthenticators() {
    this.#authenticatorsResource.reload();
  }

  incrementTOTPStage() {
    const setupTOTPStage = this.setupTOTPStage();
    if (setupTOTPStage === 1) {
      this.generateRecoveryCodes();
    } else if (setupTOTPStage === 3) {
    }
    this.setState({ setupTOTPStage: setupTOTPStage + 1 });
  }

  async generateRecoveryCodes() {
    const { data } = await client.GET("/api/0/generate-recovery-codes/");
    if (data) {
      this.setState({ recoveryCodes: data.codes });
    }
  }

  async regenerateRecoveryCodes() {
    this.setState({ loading: true, regenCodes: false });
    const { data } = await client.POST(
      "/_allauth/browser/v1/account/authenticators/recovery-codes",
    );
    if (data) {
      this.setState({
        loading: false,
        regenCodes: true,
        recoveryCodes: (data as any).data.unused_codes,
      });
    }
  }

  decrementTOTPStage() {
    this.state.update((state) => ({
      ...state,
      setupTOTPStage: state.setupTOTPStage - 1,
    }));
  }

  setCopiedCodes() {
    this.setState({ copiedCodes: true });
  }

  async getTOTPStatus() {
    const { error, response } = await client.GET(
      "/_allauth/browser/v1/account/authenticators/totp",
    );
    if (error) {
      if (response.status === 404) {
        const resp = error as AuthenticatorTOTPStatusNotFound;
        this.setState({
          totp: { secret: resp.meta.secret, totpUrl: resp.meta.totp_url },
        });
      }
    }
  }

  async activateTOTP(code: string) {
    this.setState({ loading: true });
    const { data, error, response } = await client.POST(
      "/_allauth/browser/v1/account/authenticators/totp",
      {
        body: { code },
      },
    );
    if (data) {
      this.state.update((state) => ({
        ...state,
        loading: false,
        setupTOTPStage: state.setupTOTPStage + 1,
      }));
      this.#authenticatorsResource.reload();
    } else {
      this.setState({
        loading: false,
        errors: handleAllAuthErrorResponse(error, response),
      });
    }
  }

  async deactivateTOTP() {
    this.setState({ loading: true });
    await client.DELETE("/_allauth/browser/v1/account/authenticators/totp");
    this.setState({ loading: false });
    this.#authenticatorsResource.reload();
  }

  async setRecoveryCodes(code: string) {
    this.setState({ loading: true });
    const { error, response } = await client.POST(
      "/api/0/generate-recovery-codes/",
      { body: { code } },
    );
    if (response.status !== 200) {
      this.state.update((state) => ({
        ...state,
        loading: false,
        setupTOTPStage: state.setupTOTPStage + 1,
      }));
      this.getTOTPStatus();
    } else {
      const errors = handleAllAuthErrorResponse(error, response);
      if (errors.length) {
        this.setState({ error: errors[0].message });
      }
    }
  }

  async getWebauthn() {
    this.setState({ loading: true, errors: [] });
    const { data, error } = await client.GET(
      "/_allauth/browser/v1/account/authenticators/webauthn",
    );
    if (data) {
      const credential = await create(
        parseCreationOptionsFromJSON(data.data.creation_options as any),
      );
      this.setState({ webAuthnStage: 2, loading: false, credential });
    } else {
      console.warn(error);
      this.setState({
        error: $localize`Device activation was unsuccessful.`,
        webAuthnStage: 1,
      });
    }
  }

  async addWebAuthn(name: string) {
    const credential: any = this.state().credential;
    if (credential) {
      this.setState({ loading: true, errors: [] });
      await client.POST(
        "/_allauth/browser/v1/account/authenticators/webauthn",
        {
          body: {
            name,
            credential,
          },
        },
      );
      this.clearState();
      this.#authenticatorsResource.reload();
    }
  }

  async deleteWebAuthn(id: number) {
    this.setState({ loading: true, errors: [] });
    await client.DELETE(
      "/_allauth/browser/v1/account/authenticators/webauthn",
      { body: { authenticators: [id] } },
    );
    this.#authenticatorsResource.reload();
  }
}

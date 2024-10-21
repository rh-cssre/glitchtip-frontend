import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, computed } from "@angular/core";
import {
  RegistrationPublicKeyCredential,
  create,
  parseCreationOptionsFromJSON,
} from "@github/webauthn-json/browser-ponyfill";
import {
  EMPTY,
  catchError,
  exhaustMap,
  lastValueFrom,
  of,
  tap,
  throwError,
} from "rxjs";
import { AccountService } from "src/app/api/allauth/account.service";
import {
  AllAuthError,
  AllAuthHttpErrorResponse,
  Authenticator,
  AuthenticatorTOTPStatusNotFound,
  TOTPAuthenticator,
  WebAuthnAuthenticator,
} from "src/app/api/allauth/allauth.interfaces";
import { handleAllAuthErrorResponse } from "src/app/api/allauth/allauth.utils";
import {
  messagesLookup,
  reduceParamErrors,
} from "src/app/api/allauth/errorMessages";
import { SERVER_ERROR } from "src/app/constants";
import { APIState } from "src/app/shared/shared.interfaces";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

export interface MFAState extends APIState {
  initialLoadComplete: boolean;
  authenticators: Authenticator[];
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
  initialLoadComplete: false,
  loading: false,
  authenticators: [],
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
  initialLoadComplete = computed(() => this.state().initialLoadComplete);
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
      this.state().authenticators.filter((auth) => auth.type === "totp")[0] as
        | TOTPAuthenticator
        | undefined,
  );
  webAuthnAuthenticators = computed(
    () =>
      this.state().authenticators.filter(
        (auth) => auth.type === "webauthn",
      ) as WebAuthnAuthenticator[],
  );
  codes = computed(() => this.state().recoveryCodes);
  regenCodes = computed(() => this.state().regenCodes);
  webAuthnState = computed(() => this.state().webAuthnStage);

  constructor(private accountService: AccountService) {
    super(initialState);
  }

  getAuthenticators() {
    this.setState({ loading: true });
    return this.accountService.listAuthenticators().pipe(
      tap((resp) => {
        this.setState({
          ...initialState,
          initialLoadComplete: true,
          authenticators: resp.data,
        });
      }),
    );
  }

  incrementTOTPStage() {
    const setupTOTPStage = this.setupTOTPStage();
    if (setupTOTPStage === 1) {
      lastValueFrom(this.generateRecoveryCodes());
    } else if (setupTOTPStage === 3) {
    }
    this.setState({ setupTOTPStage: setupTOTPStage + 1 });
  }

  generateRecoveryCodes() {
    return this.accountService
      .generateRecoveryCodes()
      .pipe(tap((resp) => this.setState({ recoveryCodes: resp.codes })));
  }

  regenerateRecoveryCodes() {
    this.setState({ loading: true, regenCodes: false });
    return this.accountService.regenerateRecoveryCodes().pipe(
      tap((resp) =>
        this.setState({
          loading: false,
          regenCodes: true,
          recoveryCodes: resp.data.unused_codes,
        }),
      ),
    );
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

  getTOTPStatus() {
    return this.accountService.totpAuthenticatorStatus().pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          const resp = err.error as AuthenticatorTOTPStatusNotFound;
          this.setState({
            totp: { secret: resp.meta.secret, totpUrl: resp.meta.totp_url },
          });
        }
        return of(undefined);
      }),
    );
  }

  activateTOTP(code: string) {
    this.setState({ loading: true });
    return this.accountService.activateTOTP(code).pipe(
      tap(() =>
        this.state.update((state) => ({
          ...state,
          loading: false,
          setupTOTPStage: state.setupTOTPStage + 1,
        })),
      ),
      exhaustMap(() => this.getAuthenticators()),
      catchError((err: AllAuthHttpErrorResponse) => {
        this.setState({
          loading: false,
          errors: handleAllAuthErrorResponse(err),
        });
        if ([400, 500].includes(err.status)) {
          return of(undefined);
        }
        return throwError(() => err);
      }),
    );
  }

  deactivateTOTP() {
    this.setState({ loading: true });
    return this.accountService
      .deactivateTOTP()
      .pipe(exhaustMap(() => this.getAuthenticators()));
  }

  setRecoveryCodes(code: string) {
    this.setState({ loading: true });
    return this.accountService.setRecoveryCodes(code).pipe(
      tap(() =>
        this.state.update((state) => ({
          ...state,
          loading: false,
          setupTOTPStage: state.setupTOTPStage + 1,
        })),
      ),
      exhaustMap(() => this.getTOTPStatus()),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.setState({ error: err.error.detail });
          return of(undefined);
        } else if (err.status === 500) {
          this.setState({ error: SERVER_ERROR });
          return of(undefined);
        }
        return throwError(() => err);
      }),
    );
  }

  getWebauthn() {
    this.setState({ loading: true, errors: [] });
    return this.accountService.getWebAuthn().pipe(
      exhaustMap(async (resp) => {
        return await create(
          parseCreationOptionsFromJSON(resp.data.creation_options),
        );
      }),
      tap((credential) => {
        this.setState({ webAuthnStage: 2, loading: false, credential });
      }),
      catchError((err: HttpErrorResponse) => {
        console.warn(err);
        this.setState({
          error: $localize`Device activation was unsuccessful.`,
          webAuthnStage: 1,
        });
        return EMPTY;
      }),
    );
  }

  addWebAuthn(name: string) {
    const credential = this.state().credential;
    if (credential) {
      this.setState({ loading: true, errors: [] });
      return this.accountService
        .addWebAuthn(name, this.state().credential)
        .pipe(
          tap(() => {
            this.clearState();
          }),
          exhaustMap(() => this.getAuthenticators()),
        );
    }
    return EMPTY;
  }

  deleteWebAuthn(id: number) {
    this.setState({ loading: true, errors: [] });
    return this.accountService
      .deleteWebAuthn([id])
      .pipe(exhaustMap(() => this.getAuthenticators()));
  }
}

import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY, throwError } from "rxjs";
import { catchError, exhaustMap, map, tap } from "rxjs/operators";
import {
  BackupCodes,
  TOTPResponse,
  UserKey,
  UserKeysService,
} from "src/app/api/mfa/user-keys.service";
import { ServerError } from "src/app/shared/django.interfaces";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";

interface MFAState {
  userKeys: UserKey[];
  initialLoad: boolean;
  setupTOTPStage: number;
  TOTPResponse: TOTPResponse | null;
  serverError: ServerError;
  backupCodes: BackupCodes | null;
  copiedCodes: boolean;
  /** User has successfully entered one of the backup codes, confirming they have them */
  enteredCode: boolean;
  regenCodes: boolean;
  credential: PublicKeyCredential | null;
  setupFIDO2Stage: number;
}

const initialState: MFAState = {
  userKeys: [],
  initialLoad: false,
  setupTOTPStage: 1,
  TOTPResponse: null,
  serverError: {},
  backupCodes: null,
  copiedCodes: false,
  enteredCode: false,
  regenCodes: false,
  credential: null,
  setupFIDO2Stage: 0
};

@Injectable({
  providedIn: "root",
})
export class MultiFactorAuthService extends StatefulService<MFAState> {
  initialLoad$ = this.getState$.pipe(map((state) => state.initialLoad));
  userKeys$ = this.getState$.pipe(map((state) => state.userKeys));
  TOTPKey$ = this.userKeys$.pipe(
    map((userKeys) => userKeys.find((key) => key.key_type === "TOTP"))
  );
  FIDO2Keys$ = this.userKeys$.pipe(
    map((keys) => keys.filter((key) => key.key_type === "FIDO2"))
  );
  setupTOTPStage$ = this.getState$.pipe(map((state) => state.setupTOTPStage));
  totp$ = this.getState$.pipe(map((state) => state.TOTPResponse));
  serverError$ = this.getState$.pipe(map((state) => state.serverError));
  backupCodes$ = this.getState$.pipe(map((state) => state.backupCodes));
  copiedCodes$ = this.getState$.pipe(
    map((state) => state.backupCodes !== null && state.copiedCodes)
  );
  enteredCodeSuccess$ = this.getState$.pipe(
    map((state) => state.copiedCodes && state.enteredCode)
  );
  regenCodes$ = this.getState$.pipe(
    map((state) => state.regenCodes)
  );
  setupFIDO2Stage$ = this.getState$.pipe(
    map((state) => state.setupFIDO2Stage)
  );

  constructor(
    private api: UserKeysService,
    private snackBar: MatSnackBar,
  ) {
    super(initialState);
  }

  getUserKeys() {
    return this.api
      .list()
      .pipe(tap((userKeys) => this.setState({ userKeys, initialLoad: true })));
  }

  // Will need to rework snackbar messaging when FIDO2 is added.
  deleteKey(keyId: number, keyType: string) {
    return this.api
      .destroy(keyId.toString())
      .pipe(
        exhaustMap(() => this.getUserKeys()),
        tap(() => {
          if (keyType === "TOTP") {
            this.snackBar.open("TOTP authentication deactivated.");
          } else {
            this.snackBar.open("Security key removed.");
        }})
      );
  }

  incrementTOTPStage() {
    const setupTOTPStage = this.state.getValue().setupTOTPStage;
    if (setupTOTPStage === 1) {
      this.getTOTP().subscribe();
      this.getBackupCodes().subscribe();
    }
    this.setState({ setupTOTPStage: setupTOTPStage + 1 });
  }

  decrementTOTPStage() {
    const setupTOTPStage = this.state.getValue().setupTOTPStage;
    this.setState({ setupTOTPStage: setupTOTPStage - 1 });
  }

  enableTOTP(code: string) {
    const state = this.state.getValue();
    this.setState({ serverError: {} });
    if (state.TOTPResponse) {
      return this.api
        .totpCreate({
          answer: code,
          secret_key: state.TOTPResponse.secret_key,
        })
        .pipe(
          tap(() => {
            this.clearState();
            this.getUserKeys().subscribe();
          }),
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
              if (err.error) {
                this.setState({ serverError: err.error });
              }
            }
            return EMPTY;
          })
        );
    }
    return EMPTY;
  }

  getTOTP() {
    return this.api
      .totp()
      .pipe(tap((resp) => this.setState({ TOTPResponse: resp })));
  }

  getBackupCodes() {
    return this.api.backupCodes().pipe(
      tap((resp) =>
        this.setState({
          backupCodes: resp.codes,
          copiedCodes: false,
          enteredCode: false,
        })
      )
    );
  }

  setCopiedCodes() {
    this.setState({ copiedCodes: true });
  }

  setRegenCodes() {
    this.setState({ regenCodes: true });
    this.getBackupCodes().subscribe();
  }

  verifyBackupCode(code: string) {
    const state = this.state.getValue();
    if (state.backupCodes !== null && state.backupCodes.includes(code)) {
      return this.api
        .backupCodesCreate({
          name: "Backup Codes",
          codes: state.backupCodes,
        })
        .pipe(
          tap(() => {
            if (state.regenCodes) {
              this.snackBar.open("Your new backup codes are now active.");
              this.setState({
                regenCodes: false,
                backupCodes: null,
                serverError: {},
              });
            } else {
              this.setState({
                setupTOTPStage: state.setupTOTPStage + 1,
                backupCodes: null,
                serverError: {},
              });
            }
          })
        );
    } else {
      this.setState({ serverError: { non_field_errors: ["Invalid code"] } });
    }
    return EMPTY;
  }

  activateFido2() {
    this.setState({ serverError: {} });
    this.setState({ setupFIDO2Stage: 1 });
    return this.api.fido2().pipe(
      exhaustMap(async options => {
        return await navigator.credentials.create(options);
      }), map((credResult) => {
        if (credResult === null) {
          return throwError;
        } else {
          this.setState({ credential: credResult as PublicKeyCredential });
          this.setState({ setupFIDO2Stage: 2 });
          return EMPTY;
        }
      }), catchError(err => {
        this.setState({ serverError: { non_field_errors: ["Device activation was unsuccessful."] } });
        this.setState({ setupFIDO2Stage: 0 });
        return EMPTY;
      })
    );
  }

  registerFido2(name: string) {
    const state = this.state.getValue();
    if (state.credential) {
      const attestationResponse = state.credential.response as AuthenticatorAttestationResponse;
      return this.api.fido2Create(attestationResponse, name).pipe(
        tap(() => {
          this.clearState();
          this.snackBar.open("Your security key has been registered.");
          this.getUserKeys().subscribe();
        }));
    }
    return EMPTY;
  }
}



import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY } from "rxjs";
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
  regenCodes: false
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

  constructor(private api: UserKeysService) {
    super(initialState);
  }

  getUserKeys() {
    return this.api
      .list()
      .pipe(tap((userKeys) => this.setState({ userKeys, initialLoad: true })));
  }

  deleteKey(keyId: number) {
    return this.api
      .destroy(keyId.toString())
      .pipe(exhaustMap(() => this.getUserKeys()));
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
    this.setState({ regenCodes: true })
    this.getBackupCodes().subscribe()
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
              this.setState({
                regenCodes: false,
                backupCodes: null,
                serverError: {},
              })
            } else {
              this.setState({
                setupTOTPStage: state.setupTOTPStage + 1,
                backupCodes: null,
                serverError: {},
              })
            }
          })
        );
    } else {
      this.setState({ serverError: { non_field_errors: ["Invalid code"] } });
    }
    return EMPTY;
  }
}

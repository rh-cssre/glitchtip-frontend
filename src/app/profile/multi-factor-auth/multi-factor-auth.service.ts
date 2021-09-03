import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY } from "rxjs";
import { catchError, exhaustMap, map, tap } from "rxjs/operators";
import {
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
}

const initialState: MFAState = {
  userKeys: [],
  initialLoad: false,
  setupTOTPStage: 1,
  TOTPResponse: null,
  serverError: {},
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
  setupTOTPStage$ = this.getState$.pipe(map((state) => state.setupTOTPStage));
  totp$ = this.getState$.pipe(map((state) => state.TOTPResponse));
  serverError$ = this.getState$.pipe(map((state) => state.serverError));

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
    }
    this.setState({ setupTOTPStage: setupTOTPStage + 1 });
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
          tap((_) => {
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
}

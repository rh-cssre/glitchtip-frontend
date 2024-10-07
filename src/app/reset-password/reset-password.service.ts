import { Injectable, computed } from "@angular/core";
import { catchError, of, tap, throwError } from "rxjs";
import {
  AllAuthError,
  AllAuthHttpErrorResponse,
} from "../api/allauth/allauth.interfaces";
import { APIState } from "../shared/shared.interfaces";
import { AuthenticationService } from "../api/allauth/authentication.service";
import { handleAllAuthErrorResponse } from "../api/allauth/allauth.utils";
import {
  messagesLookup,
  reduceParamErrors,
} from "../api/allauth/errorMessages";
import { StatefulService } from "../shared/stateful-service/signal-state.service";

export interface ResetPasswordState extends APIState {
  errors: AllAuthError[];
  success: boolean;
}

const initialState: ResetPasswordState = {
  loading: false,
  success: false,
  errors: [],
};

@Injectable({
  providedIn: "root",
})
export class ResetPasswordService extends StatefulService<ResetPasswordState> {
  loading = computed(() => this.state().loading);
  success = computed(() => this.state().success);
  formErrors = computed(() =>
    messagesLookup(
      this.state().errors.filter((err) => !err.param || err.param === "key"),
    ),
  );
  fieldErrors = computed(() =>
    reduceParamErrors(this.state().errors.filter((err) => err.param)),
  );

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    super(initialState);
  }

  requestPassword(email: string) {
    this.state.set({ ...initialState, loading: true });
    return this.authenticationService.requestPassword(email).pipe(
      tap(() => {
        this.state.set({ ...initialState, success: true });
      }),
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

  resetPassword(key: string, password: string) {
    this.state.set({ ...initialState, loading: true });
    return this.authenticationService.resetPassword(key, password).pipe(
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
}

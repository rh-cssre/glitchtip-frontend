import { Injectable, computed } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { AccountService } from "src/app/api/allauth/account.service";
import {
  AllAuthError,
  AllAuthHttpErrorResponse,
} from "src/app/api/allauth/allauth.interfaces";
import { handleAllAuthErrorResponse } from "src/app/api/allauth/allauth.utils";
import {
  messagesLookup,
  reduceParamErrors,
} from "src/app/api/allauth/errorMessages";
import { UserService } from "src/app/api/user/user.service";
import { APIState } from "src/app/shared/shared.interfaces";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

export interface PasswordState extends APIState {
  errors: AllAuthError[];
  success: boolean;
}

const initialState: PasswordState = {
  loading: false,
  success: false,
  errors: [],
};

@Injectable({
  providedIn: "root",
})
export class PasswordService extends StatefulService<PasswordState> {
  loading = computed(() => this.state().loading);
  errors = computed(() => this.state().errors);
  success = computed(() => this.state().success);
  formErrors = computed(() =>
    messagesLookup(this.state().errors.filter((err) => !err.param)),
  );
  fieldErrors = computed(() =>
    reduceParamErrors(this.state().errors.filter((err) => err.param)),
  );

  constructor(
    private accountService: AccountService,
    private userService: UserService,
  ) {
    super(initialState);
  }

  changePassword(current_password: string, new_password: string) {
    this.state.set(initialState);
    return this.accountService
      .changePassword(current_password, new_password)
      .pipe(
        tap(() => {
          this.state.set({ ...initialState, success: true });
          this.userService.getUserDetails();
        }),
        catchError((err: AllAuthHttpErrorResponse) => {
          this.state.set({
            ...this.state(),
            loading: false,
            errors: handleAllAuthErrorResponse(err),
          });
          return throwError(() => new Error("Unable to change password"));
        }),
      );
  }
}

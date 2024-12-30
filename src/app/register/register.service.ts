import { Injectable, computed } from "@angular/core";
import { catchError, of, tap, throwError } from "rxjs";
import { AuthService } from "../auth.service";
import { APIState } from "../shared/shared.interfaces";
import {
  AllAuthError,
  AllAuthHttpErrorResponse,
} from "../api/allauth/allauth.interfaces";
import {
  messagesLookup,
  reduceParamErrors,
} from "../api/allauth/errorMessages";
import { handleAllAuthErrorResponse } from "../api/allauth/allauth.utils";
import { StatefulService } from "../shared/stateful-service/signal-state.service";

export interface RegisterState extends APIState {
  errors: AllAuthError[];
}

const initialState: RegisterState = {
  loading: false,
  errors: [],
};

@Injectable({
  providedIn: "root",
})
export class RegisterService extends StatefulService<RegisterState> {
  formErrors = computed(() =>
    messagesLookup(this.state().errors.filter((err) => !err.param)),
  );
  fieldErrors = computed(() =>
    reduceParamErrors(this.state().errors.filter((err) => err.param)),
  );
  constructor(private authService: AuthService) {
    super(initialState);
  }

  register(email: string, password: string) {
    this.state.set({ ...this.state(), loading: true, errors: [] });
    this.authService.signup(email, password);
    return this.authService.signup(email, password).pipe(
      tap(() => this.state.set(initialState)),
      catchError((err: AllAuthHttpErrorResponse) => {
        this.state.set({
          ...this.state(),
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

  socialRegister(provider: string, callbackUrl = "/") {
    this.setState({ loading: true, errors: [] });
    this.authService.providerRedirect(provider, callbackUrl, "login");
  }
}

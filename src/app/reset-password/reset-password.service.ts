import { Injectable, computed, inject } from "@angular/core";
import { AllAuthError } from "../api/allauth/allauth.interfaces";
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
  private authenticationService = inject(AuthenticationService);

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

  constructor() {
    super(initialState);
  }

  async requestPassword(email: string) {
    this.state.set({ ...initialState, loading: true });
    const { data, error, response } = await this.authenticationService.requestPassword(email);
    if (data) {
      this.setState({ success: true });
      return
    }
    this.setState({
      loading: false,
      errors: handleAllAuthErrorResponse(error, response),
    });
  }

  async resetPassword(key: string, password: string) {
    this.setState({ loading: true });
    const { data, error, response } = await this.authenticationService.resetPassword(
      key,
      password,
    );
    if (!response.ok) {
      this.setState({
        loading: false,
        errors: handleAllAuthErrorResponse(error, response),
      });
    }
    return data;
  }
}

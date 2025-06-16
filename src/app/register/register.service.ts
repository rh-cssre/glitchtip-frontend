import { Injectable, computed, inject } from "@angular/core";
import { AuthService } from "../auth.service";
import { APIState } from "../shared/shared.interfaces";
import { AllAuthError } from "../api/allauth/allauth.interfaces";
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
  private authService = inject(AuthService);

  formErrors = computed(() =>
    messagesLookup(this.state().errors.filter((err) => !err.param)),
  );
  fieldErrors = computed(() =>
    reduceParamErrors(this.state().errors.filter((err) => err.param)),
  );
  constructor() {
    super(initialState);
  }

  async register(email: string, password: string) {
    this.setState({ loading: true, errors: [] });
    const { data, error, response } = await this.authService.signup(
      email,
      password,
    );
    this.state.set(initialState);
    if (!response.ok) {
      this.setState({
        loading: false,
        errors: handleAllAuthErrorResponse(error, response),
      });
    }
    return data;
  }

  socialRegister(provider: string, callbackUrl = "/") {
    this.setState({ loading: true, errors: [] });
    this.authService.providerRedirect(provider, callbackUrl, "login");
  }
}

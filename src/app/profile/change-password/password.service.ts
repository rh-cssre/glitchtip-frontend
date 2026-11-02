import { Injectable, computed, inject } from "@angular/core";
import { AllAuthError } from "src/app/api/allauth/allauth.interfaces";
import { handleAllAuthErrorResponse } from "src/app/api/allauth/allauth.utils";
import {
  messagesLookup,
  reduceParamErrors,
} from "src/app/api/allauth/errorMessages";
import { UserService } from "src/app/api/user/user.service";
import { client } from "src/app/shared/api/api";
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
  private userService = inject(UserService);

  loading = computed(() => this.state().loading);
  errors = computed(() => this.state().errors);
  success = computed(() => this.state().success);
  formErrors = computed(() =>
    messagesLookup(this.state().errors.filter((err) => !err.param)),
  );
  fieldErrors = computed(() =>
    reduceParamErrors(this.state().errors.filter((err) => err.param)),
  );

  constructor() {
    super(initialState);
  }

  async changePassword(current_password: string, new_password: string) {
    this.state.set(initialState);
    const { error, response } = await client.POST(
      "/_allauth/browser/v1/account/password/change",
      {
        body: {
          current_password,
          new_password,
        },
      },
    );
    if (error) {
      this.state.set({
        ...this.state(),
        loading: false,
        errors: handleAllAuthErrorResponse(error, response),
      });
      return false;
    }
    this.state.set({ ...initialState, success: true });
    this.userService.getUserDetails();
    return true;
  }
}

import { Injectable, computed } from "@angular/core";
import { AllAuthError } from "../api/allauth/allauth.interfaces";
import { APIState } from "../shared/shared.interfaces";
import { handleAllAuthErrorResponse } from "../api/allauth/allauth.utils";
import {
  messagesLookup,
  reduceParamErrors,
} from "../api/allauth/errorMessages";
import { StatefulService } from "../shared/stateful-service/signal-state.service";
import { client } from "../shared/api/api";

export interface ResetPasswordState extends APIState {
  errors: AllAuthError[];
  success: boolean;
}

const initialState: ResetPasswordState = {
  loading: false,
  success: false,
  errors: [],
};

@Injectable()
export class ResetPasswordService extends StatefulService<ResetPasswordState> {
  loading = computed(() => this.state().loading);
  success = computed(() => this.state().success);
  errors = computed(() => this.state().errors);
  formErrors = computed(() =>
    messagesLookup(
      this.errors().filter((err) => !err.param || err.param === "key"),
    ),
  );
  fieldErrors = computed(() =>
    reduceParamErrors(this.errors().filter((err) => err.param)),
  );

  constructor() {
    super(initialState);
  }

  async requestPassword(email: string) {
    this.setState({ loading: true });
    const { data, error, response } = await client.POST(
      "/_allauth/browser/v1/auth/password/request",
      {
        body: {
          email,
        },
      },
    );
    if (data) {
      this.setState({ success: true });
      return;
    }
    this.setState({
      loading: false,
      errors: handleAllAuthErrorResponse(error, response),
    });
  }
}

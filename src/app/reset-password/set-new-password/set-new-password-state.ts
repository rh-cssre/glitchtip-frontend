import { computed, Injectable } from "@angular/core";
import { AllAuthError } from "src/app/api/allauth/allauth.interfaces";
import { handleAllAuthErrorResponse } from "src/app/api/allauth/allauth.utils";
import { client } from "src/app/shared/api/api";
import { APIState } from "src/app/shared/shared.interfaces";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

export interface SetNewPasswordState extends APIState {
  errors: AllAuthError[];
}

const initialState: SetNewPasswordState = {
  loading: false,
  errors: [],
};

@Injectable()
export class SetNewPasswordService extends StatefulService<SetNewPasswordState> {
  constructor() {
    super(initialState);
  }

  errors = computed(() => this.state().errors);
  loading = computed(() => this.state().loading);

  async resetPassword(key: string, password: string) {
    this.setState({ loading: true });
    const { error, response } = await client.POST(
      "/_allauth/browser/v1/auth/password/reset",
      {
        body: {
          key,
          password,
        },
      },
    );
    if (!response.ok && response.status !== 401) {
      // API responds 401 on success
      this.setState({
        loading: false,
        errors: handleAllAuthErrorResponse(error, response),
      });
      return false;
    }
    return true;
  }
}

import { Injectable, computed, inject, resource } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { client } from "src/app/shared/api/api";
import { UNHANDLED_ERROR } from "src/app/constants";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

interface CreateErrorFields {
  label: string;
  scopes: string;
}

export interface AuthTokensState {
  createLoading: boolean;
  deleteLoading: number[];
  createErrorFields: CreateErrorFields;
  createErrorForm: string;
}

const initialState: AuthTokensState = {
  createLoading: false,
  deleteLoading: [],
  createErrorFields: { label: "", scopes: "" },
  createErrorForm: "",
};

interface APITokenError {
  detail: Array<{ msg: string } | { scopes: string }>;
}

@Injectable({
  providedIn: "root",
})
export class AuthTokensService extends StatefulService<AuthTokensState> {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  apiTokensResource = resource({
    loader: () => client.GET("/api/0/api-tokens/"),
  });

  readonly apiTokens = computed(() => this.apiTokensResource.value()?.data);
  readonly initialLoad = computed(() => this.apiTokensResource.hasValue());
  readonly createErrorFields = computed(() => {
    let errorFields: { [key: string]: string[] } = {};
    Object.entries(this.state().createErrorFields).forEach(([key, value]) => {
      if (value) {
        errorFields[key] = [value];
      }
    });
    return errorFields;
  });
  readonly createErrorForm = computed(() => this.state().createErrorForm);
  readonly createLoading = computed(() => this.state().createLoading);
  readonly deleteLoading = computed(() => this.state().deleteLoading);

  constructor() {
    super(initialState);
  }

  async createAuthToken(label: string, scopes: string[]) {
    this.setCreateLoadingStart();
    const { data, error, response } = await client.POST("/api/0/api-tokens/", {
      body: {
        label,
        scopes: scopes as any,
      },
    });
    if (data) {
      this.setCreateLoadingComplete();
      this.router.navigate(["/profile/auth-tokens"]);
      return;
    }
    let errorFields = { label: "", scopes: "" };
    let errorForm = "";
    const statusCode = response.status;
    if (error) {
      if (statusCode === 422) {
        const errorDetail = (error as APITokenError).detail[0];
        if ("msg" in errorDetail) {
          errorFields.label = errorDetail.msg;
        }
        if ("scopes" in errorDetail) {
          errorFields.scopes = errorDetail.scopes;
        }
      } else {
        errorForm = UNHANDLED_ERROR;
      }
      this.setCreateLoadingError(errorFields, errorForm);
    }
  }

  async deleteAuthToken(id: number) {
    this.setDeleteLoadingStart(id);
    const { response } = await client.DELETE(`/api/0/api-tokens/{token_id}/`, {
      params: {
        path: {
          token_id: id,
        },
      },
    });
    if (response.ok) {
      this.setDeleteLoadingComplete(id);
      this.apiTokensResource.reload();
      return;
    }
    this.setDeleteLoadingError(id);
    this.snackBar.open($localize`
      There was an error deleting your token, please try again.
    `);
  }

  private setDeleteLoadingStart(id: number) {
    let state = this.state();
    this.setState({
      deleteLoading: state.deleteLoading.concat([id]),
    });
  }

  private setDeleteLoadingComplete(deletedId: number) {
    let state = this.state();
    this.setState({
      deleteLoading: state.deleteLoading.filter((id) => id !== deletedId),
    });
  }

  private setDeleteLoadingError(deletedId: number) {
    let state = this.state();
    this.setState({
      deleteLoading: state.deleteLoading.filter((id) => id !== deletedId),
    });
  }

  private setCreateLoadingStart() {
    this.setState({
      createLoading: true,
      createErrorFields: initialState.createErrorFields,
      createErrorForm: "",
    });
  }

  private setCreateLoadingComplete() {
    this.setState({ createLoading: false });
  }

  private setCreateLoadingError(
    createErrorFields: CreateErrorFields,
    createErrorForm: string,
  ) {
    this.setState({
      createErrorFields,
      createErrorForm,
      createLoading: false,
    });
  }
}

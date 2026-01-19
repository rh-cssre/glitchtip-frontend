import { computed, effect, inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { client, handleError } from "../../shared/api/api";
import { components } from "../api-schema";
import { AuthService } from "src/app/auth.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";
import { apiResource } from "src/app/shared/api/api-resource-factory";

type UserOptions = components["schemas"]["UserOptions"];

interface UserState {
  userDeleteError: string | null;
  userDeleteLoading: boolean;
  disconnectLoading: number | null;
  throttleWarningDismissedOrgs: string[];
}

const initialState: UserState = {
  userDeleteError: null,
  userDeleteLoading: false,
  disconnectLoading: null,
  throttleWarningDismissedOrgs: [],
};

const mePath = { user_id: "me" } as const;

@Injectable({
  providedIn: "root",
})
export class UserService extends StatefulService<UserState> {
  private snackBar = inject(MatSnackBar);

  authService = inject(AuthService);

  userResource = apiResource(this.authService.isAuthenticated, () => ({
    url: "/api/0/users/{user_id}/",
    options: {
      params: { path: mePath },
    },
  }));
  user = computed(() => this.userResource.value());
  // Tracks throttle warnings dismissed by user in current session
  throttleWarningDismissedOrgs = computed(
    () => this.state().throttleWarningDismissedOrgs,
  );
  activeUserEmail = computed(() => this.user()?.email);
  readonly userDeleteError = computed(() => this.state().userDeleteError);
  readonly userDeleteLoading = computed(() => this.state().userDeleteLoading);
  readonly disconnectLoading = computed(() => this.state().disconnectLoading);

  constructor() {
    super(initialState);
    setTimeout(() => this.refresh(), 10000);
    effect(() => {
      const user = this.user();
      if (user?.chatwootIdentifierHash) {
        let chatwootUser = {
          email: user.email,
          identifier_hash: user.chatwootIdentifierHash,
        };
        // Chatwoot may not always be ready at this point
        if ((window as any).$chatwoot) {
          (window as any).$chatwoot.setUser(user.id, chatwootUser);
        } else {
          window.addEventListener("chatwoot:ready", function () {
            (window as any).$chatwoot.setUser(user.id, chatwootUser);
          });
        }
      }
    });
  }

  /** Get and set current logged in user details from backend */
  getUserDetails() {
    this.userResource.reload();
  }

  async deleteUser() {
    this.setUserDeleteLoadingStart();
    const { error, response } = await client.DELETE("/api/0/users/{user_id}/", {
      params: { path: mePath },
    });
    if (response.ok) {
      return true;
    }

    if (response.status === 400) {
      this.setUserDeleteError(
        $localize`Could not delete account. Delete or transfer ownership of all organizations you are the owner of before deleting your user account.`,
      );
    } else {
      const errors = handleError(error, response);
      if (errors.detail.length) {
        this.setUserDeleteError(
          errors.detail[0].msg ||
            $localize`There was an error deleting your account. Please try again.`,
        );
      }
    }
    return false;
  }

  updateUser(name: string, options: UserOptions) {
    client
      .PUT("/api/0/users/{user_id}/", {
        params: {
          path: mePath,
        },
        body: { name, options },
      })
      .then((result) => {
        if (result.data) {
          this.userResource.set(result.data);
          this.snackBar.open("Preferences have been updated");
        } else {
          this.snackBar.open("Error attempting to update preferences");
        }
      });
  }

  clearUserUIState() {
    this.setState({
      userDeleteError: initialState.userDeleteError,
      userDeleteLoading: initialState.userDeleteLoading,
      disconnectLoading: initialState.disconnectLoading,
    });
  }

  reload() {
    this.userResource.reload();
  }

  dismissThrottleWarning(orgSlug: string) {
    const state = this.state();
    this.setState({
      throttleWarningDismissedOrgs: state.throttleWarningDismissedOrgs.concat([
        orgSlug,
      ]),
    });
  }

  private setUserDeleteLoadingStart() {
    this.setState({
      userDeleteLoading: true,
    });
  }

  private setUserDeleteError(error: string) {
    this.setState({
      userDeleteLoading: false,
      userDeleteError: error,
    });
  }

  private refresh() {
    this.reload();
    setTimeout(() => this.refresh(), 20 * 60 * 1000); // 20 min
  }
}

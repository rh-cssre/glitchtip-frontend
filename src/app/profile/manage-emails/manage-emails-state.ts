import { computed, inject, Injectable, resource } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { client, handleError } from "src/app/shared/api/api";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

interface LoadingStates {
  add: boolean;
  /**
   * Theoretically you could be deleting two at once and the UI won't
   * reflect this.
   */
  delete: string | null;
  /**
   * If you click one "Make primary" button and then another quickly, could
   * cause problems.
   */
  makePrimary: string | null;
  resendConfirmation: string | null;
}

interface EmailState {
  loadingStates: LoadingStates;
  addEmailError: string;
}

const initialState: EmailState = {
  loadingStates: {
    add: false,
    delete: null,
    makePrimary: null,
    resendConfirmation: null,
  },
  addEmailError: "",
};

@Injectable()
export class ManageEmailsState extends StatefulService<EmailState> {
  #snackbar = inject(MatSnackBar);
  #emailAddressesResource = resource({
    loader: async ({ abortSignal }) => {
      const { data } = await client.GET("/api/0/users/{user_id}/emails/", {
        signal: abortSignal,
        params: {
          path: {
            user_id: "me",
          },
        },
      });
      return data;
    },
  });
  emailAddresses = computed(() => this.#emailAddressesResource.value() || []);
  emailAddressesSorted = computed(() =>
    this.emailAddresses().sort((a, b) =>
      a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1,
    ),
  );
  loadingStates = computed(() => this.state().loadingStates);
  addEmailError = computed(() => this.state().addEmailError);

  constructor() {
    super(initialState);
  }

  async addEmailAddress(email: string) {
    this.setState({
      addEmailError: "",
      loadingStates: { ...this.state().loadingStates, add: true },
    });
    const { data, error, response } = await client.POST(
      "/api/0/users/{user_id}/emails/",
      {
        params: {
          path: {
            user_id: "me",
          },
        },
        body: { email },
      },
    );
    this.setState({
      loadingStates: { ...this.state().loadingStates, add: false },
    });
    if (data) {
      this.#emailAddressesResource.update((emails) =>
        emails ? emails.concat([data]) : [data],
      );
      return true;
    }
    const errors = handleError(error, response);
    if (errors.detail.length) {
      this.setState({ addEmailError: errors.detail[0].msg });
    }
    return false;
  }

  async removeEmailAddress(email: string) {
    this.setState({
      loadingStates: { ...this.state().loadingStates, delete: email },
    });
    const { error } = await client.DELETE("/api/0/users/{user_id}/emails/", {
      params: { path: { user_id: "me" } },
      body: { email },
    });
    this.setState({
      loadingStates: { ...this.state().loadingStates, delete: null },
    });
    if (error) {
      this.#snackbar.open($localize`There was a problem. Try again later.`);
      return false;
    }
    this.#emailAddressesResource.update((emails) =>
      emails?.filter((em) => em.email !== email),
    );
    this.#snackbar.open(
      $localize`${email} has been removed from your account.`,
    );
    return true;
  }

  async makeEmailPrimary(email: string) {
    this.setState({
      loadingStates: { ...this.state().loadingStates, makePrimary: email },
    });
    const { data, error, response } = await client.PUT(
      "/api/0/users/{user_id}/emails/",
      {
        params: { path: { user_id: "me" } },
        body: { email },
      },
    );
    if (data) {
      this.setState({
        loadingStates: { ...this.state().loadingStates, makePrimary: "" },
      });
      this.#emailAddressesResource.reload();
      this.#snackbar.open(
        $localize`${email} is now your primary email address.`,
      );
      return true;
    }
    const errors = handleError(error, response);
    if (errors.detail.length) {
      this.#snackbar.open(errors.detail[0].msg);
    }
    return false;
  }

  async resendConfirmation(email: string) {
    this.setState({
      loadingStates: {
        ...this.state().loadingStates,
        resendConfirmation: email,
      },
    });
    const { error, response } = await client.POST(
      "/api/0/users/{user_id}/emails/confirm/",
      {
        params: { path: { user_id: "me" } },
        body: { email },
      },
    );
    if (response.ok) {
      this.setState({
        loadingStates: {
          ...this.state().loadingStates,
          resendConfirmation: "",
        },
      });
      this.#snackbar.open(`A confirmation email has been sent to ${email}.`);
      return true;
    }
    if (error) {
      const errors = handleError(error, response);
      if (errors.detail.length) {
        this.setState({
          loadingStates: {
            ...this.state().loadingStates,
            resendConfirmation: "",
          },
        });
        this.#snackbar.open(errors.detail[0].msg);
      }
    }
    return false;
  }
}

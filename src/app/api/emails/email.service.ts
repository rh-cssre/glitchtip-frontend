import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, Subject, EMPTY } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
import { EmailAddress } from "./email.interfaces";
import { baseUrl } from "../../constants";

type LoadingStateNames =
  | "add"
  | "delete"
  | "makePrimary"
  | "resendConfirmation";

interface LoadingStates {
  add: boolean;
  /**
   * Theoretically you could be deleting two at once and the UI won't
   * reflect this. Didn't think it was a 1.0 problem
   */
  delete: string | null;
  /**
   * If you click one "Make primary" button and then another quickly, could
   * cause problems. Again, didn't think it was a 1.0 problem
   */
  makePrimary: string | null;
  resendConfirmation: string | null;
}

interface EmailState {
  emailAddresses: EmailAddress[];
  loadingStates: LoadingStates;
  addEmailError: string;
}

const initialState: EmailState = {
  emailAddresses: [],
  loadingStates: {
    add: false,
    delete: null,
    makePrimary: null,
    resendConfirmation: null,
  },
  addEmailError: "",
};

@Injectable({
  providedIn: "root",
})
export class EmailService {
  private readonly state = new BehaviorSubject<EmailState>(initialState);
  readonly resetFormSubject = new Subject();
  readonly emailAddresses$ = this.state.pipe(
    map((state) => state.emailAddresses)
  );
  readonly loadingStates$ = this.state.pipe(
    map((state) => state.loadingStates)
  );
  readonly addEmailError$ = this.state.pipe(
    map((state) => state.addEmailError)
  );
  /**
   * A list of the user's email addresses, with primary email on top
   *
   * The backend allows multiple emails with isPrimary === true, but the
   * frontend is not built to accommodate this
   */
  readonly emailAddressesSorted$ = this.emailAddresses$.pipe(
    map((emailAddresses) =>
      // Sort by boolean https://stackoverflow.com/a/17387454/443457
      [...emailAddresses].sort((a, b) =>
        a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1
      )
    )
  );

  private readonly url = baseUrl + "/users/me/emails/";
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  retrieveEmailAddresses() {
    this.getEmailAddresses()
      .pipe(tap((response: EmailAddress[]) => this.setEmailAddresses(response)))
      .subscribe();
  }

  addEmailAddress(email: string) {
    this.setLoadingAdd();
    this.postEmailAddress(email)
      .pipe(
        tap((response: EmailAddress) => {
          this.setNewEmailAddress(response);
          this.resetFormSubject.next(undefined);
          this.resetLoadingAdd();
          this.setAddEmailError("");
        }),
        catchError((error) => {
          this.resetLoadingAdd();
          if (error.error?.non_field_errors) {
            this.setAddEmailError(error.error.non_field_errors.join(", "));
          } else {
            if (
              error.status === 500 &&
              (error.error as string).includes(
                `'to' parameter is not a valid address`
              )
            ) {
              this.setAddEmailError(
                "This is not a valid email address. Please try another one."
              );
            } else if (error.status === 500) {
              this
                .setAddEmailError(`There was a problem. Refresh the page to see if your email is
                on the list. You may need to try again, or try a different
                email address.`);
            } else if (error.status === 400) {
              this.setAddEmailError("This email address is already being used.");
            } else {
              this.setAddEmailError("There was a problem. Please try again.");
            }
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  removeEmailAddress(email: string) {
    this.setLoadingDelete(email);
    this.deleteEmailAddress(email)
      .pipe(
        tap((_) => {
          this.setRemovedEmailAddress(email);
          this.resetLoadingDelete();
          this.setSnackbarMessage(
            `${email} has been removed from your account.`
          );
        }),
        catchError((_) => {
          this.resetLoadingDelete();
          this.setSnackbarMessage(`There was a problem. Try again later.`);
          return EMPTY;
        })
      )
      .subscribe();
  }

  makeEmailPrimary(email: string) {
    this.setLoadingMakePrimary(email);
    this.putEmailAddress(email)
      .pipe(
        tap((response) => {
          this.setNewPrimaryEmail(response);
          this.resetLoadingMakePrimary();
          this.setSnackbarMessage(
            `${email} is now your primary email address.`
          );
        }),
        catchError((error) => {
          this.resetLoadingMakePrimary();
          this.setSnackbarMessage(`There was a problem. Try again later.`);
          return EMPTY;
        })
      )
      .subscribe();
  }

  resendConfirmation(email: string) {
    this.setLoadingResend(email);
    this.sendConfirmation(email)
      .pipe(
        tap((_) => {
          this.resetLoadingResend();
          this.setSnackbarMessage(
            `A confirmation email has been sent to ${email}.`
          );
        }),
        catchError((_) => {
          this.resetLoadingResend();
          this.setSnackbarMessage(`There was a problem. Try again later.`);
          return EMPTY;
        })
      )
      .subscribe();
  }

  setLoadingAdd = () => this.setLoadingState("add");
  setLoadingDelete = (value: string) => this.setLoadingState("delete", value);
  setLoadingMakePrimary = (value: string) =>
    this.setLoadingState("makePrimary", value);
  setLoadingResend = (value: string) =>
    this.setLoadingState("resendConfirmation", value);

  resetLoadingAdd = () => this.resetLoadingState("add");
  resetLoadingDelete = () => this.resetLoadingState("delete");
  resetLoadingMakePrimary = () => this.resetLoadingState("makePrimary");
  resetLoadingResend = () => this.resetLoadingState("resendConfirmation");

  private setSnackbarMessage(message: string) {
    this.snackBar.open(message);
  }

  private getEmailAddresses() {
    return this.http.get<EmailAddress[]>(this.url);
  }

  private postEmailAddress(email: string) {
    return this.http.post<EmailAddress>(this.url, { email });
  }

  private deleteEmailAddress(email: string) {
    // Delete with body, from https://stackoverflow.com/a/40857437/
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: { email },
    };
    return this.http.delete<null>(this.url, options);
  }

  private putEmailAddress(email: string) {
    return this.http.put<EmailAddress>(this.url, { email });
  }

  private sendConfirmation(email: string) {
    return this.http.post<EmailAddress>(this.url + "confirm/", { email });
  }

  private setEmailAddresses(emailAddresses: EmailAddress[]) {
    this.state.next({ ...this.state.getValue(), emailAddresses });
  }

  private setNewEmailAddress(emailAddress: EmailAddress) {
    const current = this.state.getValue();
    this.state.next({
      ...current,
      emailAddresses: [...current.emailAddresses].concat(emailAddress),
    });
  }

  /**
   * - Make isPrimary false on formerly primary email
   * - Make isPrimary new on the new primary email, which is done here by
   *   replacing it with the API response
   * - Put new primary email up top
   */
  private setNewPrimaryEmail(newPrimaryEmail: EmailAddress) {
    const current = this.state.getValue();
    const nonPrimaryEmails = [...current.emailAddresses]
      .filter((email) => email.email !== newPrimaryEmail.email)
      .map((email) => ({ ...email, isPrimary: false }));

    this.state.next({
      ...current,
      emailAddresses: [newPrimaryEmail].concat(nonPrimaryEmails),
    });
  }

  private setRemovedEmailAddress(emailToDelete: string) {
    const current = this.state.getValue();
    const indexToDelete = current.emailAddresses.findIndex(
      (email) => email.email === emailToDelete
    );
    let emailAddresses = current.emailAddresses;
    if (indexToDelete > -1) {
      emailAddresses = current.emailAddresses
        .slice(0, indexToDelete)
        .concat(
          current.emailAddresses.slice(
            indexToDelete + 1,
            current.emailAddresses.length
          )
        );
    }

    this.state.next({ ...current, emailAddresses });
  }

  private setLoadingState(stateToSet: LoadingStateNames, value?: string) {
    const current = this.state.getValue();
    const loadingStates = { ...current.loadingStates };
    if (stateToSet === "add") {
      loadingStates.add = true;
    } else {
      if (value) {
        loadingStates[stateToSet] = value;
      }
    }

    this.state.next({ ...current, loadingStates });
  }

  private resetLoadingState(stateToReset: LoadingStateNames) {
    const current = this.state.getValue();
    const loadingStates = { ...current.loadingStates };
    if (stateToReset === "add") {
      loadingStates.add = false;
    } else {
      loadingStates[stateToReset] = null;
    }

    this.state.next({ ...current, loadingStates });
  }

  private setAddEmailError = (message: string) => {
    this.state.next({ ...this.state.getValue(), addEmailError: message });
  };
}

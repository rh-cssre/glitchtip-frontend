import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { EmailAddress } from "./email.interfaces";
import { tap, map } from "rxjs/operators";
import { baseUrl } from "../../constants";

type LoadingStateNames = "add" | "delete" | "makePrimary";

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
}

interface EmailState {
  emailAddresses: EmailAddress[];
  loadingStates: LoadingStates;
}

const initialState: EmailState = {
  emailAddresses: [],
  loadingStates: {
    add: false,
    delete: null,
    makePrimary: null,
  },
};

@Injectable({
  providedIn: "root",
})
export class EmailService {
  private readonly state = new BehaviorSubject<EmailState>(initialState);
  readonly emailAddresses$ = this.state.pipe(
    map((state) => state.emailAddresses)
  );
  readonly loadingStates$ = this.state.pipe(
    map((state) => state.loadingStates)
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
  constructor(private http: HttpClient) {}

  retrieveEmailAddresses() {
    this.getEmailAddresses()
      .pipe(tap((response: EmailAddress[]) => this.setEmailAddresses(response)))
      .subscribe();
  }

  addEmailAddress(email: string) {
    return this.postEmailAddress(email).pipe(
      tap((response: EmailAddress) => this.setNewEmailAddress(response))
    );
  }

  removeEmailAddress(email: string) {
    return this.deleteEmailAddress(email).pipe(
      tap((_) => this.setRemovedEmailAddress(email))
    );
  }

  makeEmailPrimary(email: string) {
    return this.putEmailAddress(email).pipe(
      tap((response) => this.setNewPrimaryEmail(response))
    );
  }

  setLoadingAdd = () => this.setLoadingState("add");
  setLoadingDelete = (value: string) => this.setLoadingState("delete", value);
  setLoadingMakePrimary = (value: string) =>
    this.setLoadingState("makePrimary", value);

  resetLoadingAdd = () => this.resetLoadingState("add");
  resetLoadingDelete = () => this.resetLoadingState("delete");
  resetLoadingMakePrimary = () => this.resetLoadingState("makePrimary");

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
}

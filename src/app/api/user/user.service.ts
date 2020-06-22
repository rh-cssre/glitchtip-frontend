import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { UserDetails, EmailAddress } from "./user.interfaces";
import { tap, map } from "rxjs/operators";
import { OAuthProvider } from "../oauth/oauth.interfaces";
import { baseUrl } from "src/app/constants";

interface UserState {
  user: UserDetails | null;
  emailAddresses: EmailAddress[];
}

const initialState: UserState = {
  user: null,
  emailAddresses: [],
};

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly state = new BehaviorSubject<UserState>(initialState);
  readonly userDetails$ = this.state.pipe(map((state) => state.user));
  readonly emailAddresses$ = this.state.pipe(
    map((state) => state.emailAddresses)
  );
  /**
   * A list of the user's email addresses, with primary email on top
   *
   * The backend allows multiple emails with isPrimary === true, but the
   * frontend is not built to accommodate this
   */
  readonly emailAddressesSorted$ = this.emailAddresses$.pipe(
    map((emailAddresses) => {
      if (emailAddresses.length > 0) {
        const primaryEmailIndex = emailAddresses.findIndex(
          (email) => email.isPrimary
        );
        // Immutable splice
        const sortedEmails = [emailAddresses[primaryEmailIndex]]
          .concat(emailAddresses.slice(0, primaryEmailIndex))
          .concat(
            emailAddresses.slice(primaryEmailIndex + 1, emailAddresses.length)
          );
        return sortedEmails;
      }
      return emailAddresses;
    })
  );

  readonly activeUserEmail$ = this.userDetails$.pipe(
    map((userDetails) => userDetails?.email)
  );
  readonly isGoogleConnected$ = this.userDetails$.pipe(
    map((user) => this.isOAuthConnected(user, "google"))
  );
  readonly isMicrosoftConnected$ = this.userDetails$.pipe(
    map((user) => this.isOAuthConnected(user, "microsoft"))
  );
  readonly isGitlabConnected$ = this.userDetails$.pipe(
    map((user) => this.isOAuthConnected(user, "gitlab"))
  );
  readonly isGithubConnected$ = this.userDetails$.pipe(
    map((user) => this.isOAuthConnected(user, "github"))
  );
  private readonly url = "/rest-auth/user/";
  private readonly emailAddressesUrl = baseUrl + "/users/me/emails/";
  constructor(private http: HttpClient) {}

  /** Get and set current logged in user details from backend */
  getUserDetails() {
    this.retrieveUserDetails()
      .pipe(tap((resp: UserDetails) => this.setUserDetails(resp)))
      .toPromise();
  }
  private retrieveUserDetails() {
    return this.http.get<UserDetails>(this.url);
  }

  private setUserDetails(userDetails: UserDetails) {
    this.state.next({ ...this.state.getValue(), user: userDetails });
  }

  retrieveEmailAddresses() {
    this.getEmailAddresses()
      .pipe(tap((response: EmailAddress[]) => this.setEmailAddresses(response)))
      .toPromise();
  }

  addEmailAddress(email: string) {
    return this.postEmailAddress(email)
      .pipe(tap((response: EmailAddress) => this.setNewEmailAddress(response)))
      .toPromise();
  }

  removeEmailAddress(email: string) {
    return this.deleteEmailAddress(email)
      .pipe(tap((_) => this.setRemovedEmailAddress(email)))
      .toPromise();
  }

  makeEmailPrimary(email: string) {
    return this.putEmailAddress(email)
      .pipe(tap((response) => this.setNewPrimaryEmail(response)))
      .toPromise();
  }

  private getEmailAddresses() {
    return this.http.get<EmailAddress[]>(this.emailAddressesUrl);
  }

  private postEmailAddress(email) {
    return this.http.post<EmailAddress>(this.emailAddressesUrl, { email });
  }

  private deleteEmailAddress(email) {
    // Is this the best way? https://stackoverflow.com/a/40857437/ says so
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: { email },
    };
    return this.http.delete<null>(this.emailAddressesUrl, options);
  }

  private putEmailAddress(email) {
    return this.http.put<EmailAddress>(this.emailAddressesUrl, { email });
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
   * Need to
   * - find the old primary email and make isPrimary false
   * - make isPrimary new on the new primary email, which is done here by
   *   replacing it with the API response
   * - put new primary email up top
   */
  private setNewPrimaryEmail(newPrimaryEmail: EmailAddress) {
    const current = this.state.getValue();
    const emails = [...current.emailAddresses];

    const indexOfNewPrimary = emails.findIndex(
      (email) => email.email === newPrimaryEmail.email
    );
    emails.splice(indexOfNewPrimary, 1);

    const indexOfOldPrimary = emails.findIndex(
      (email) => email.isPrimary === true
    );
    if (indexOfOldPrimary > -1) {
      emails[indexOfOldPrimary] = {
        ...emails[indexOfOldPrimary],
        isPrimary: false,
      };
    }
    this.state.next({
      ...current,
      emailAddresses: [newPrimaryEmail].concat(emails),
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

  /** Check if at least one social account exists with this provider */
  private isOAuthConnected(user: UserDetails | null, provider: OAuthProvider) {
    return (
      user?.socialaccount_set.findIndex(
        (account) => account.provider === provider
      ) !== -1
    );
  }
}

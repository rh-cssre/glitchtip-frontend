import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";
import { User } from "./user.interfaces";
import { OAuthProvider } from "../oauth/oauth.interfaces";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly state = new BehaviorSubject<UserState>(initialState);
  readonly userDetails$ = this.state.pipe(map((state) => state.user));

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
  private readonly url = "/api/0/users/me/";

  constructor(private http: HttpClient) {}

  /** Get and set current logged in user details from backend */
  getUserDetails() {
    this.retrieveUserDetails()
      .pipe(tap((resp: User) => this.setUserDetails(resp)))
      .subscribe();
  }
  private retrieveUserDetails() {
    return this.http.get<User>(this.url);
  }

  private setUserDetails(userDetails: User) {
    this.state.next({ ...this.state.getValue(), user: userDetails });
  }

  /** Check if at least one social account exists with this provider */
  private isOAuthConnected(user: User | null, provider: OAuthProvider) {
    return (
      user?.identities.findIndex((account) => account.provider === provider) !==
      -1
    );
  }
}

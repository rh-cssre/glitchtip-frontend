import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, EMPTY, Subject } from "rxjs";
import { tap, map, catchError, exhaustMap } from "rxjs/operators";
import { User } from "./user.interfaces";

interface UserState {
  user: User | null;
  disconnectLoading: number | null;
}

const initialState: UserState = {
  user: null,
  disconnectLoading: null,
};

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly state = new BehaviorSubject<UserState>(initialState);
  readonly userDetails$ = this.state.pipe(map((state) => state.user));
  readonly disconnectLoading$ = this.state.pipe(
    map((state) => state.disconnectLoading)
  );
  private readonly getUserDetailsAction = new Subject();

  readonly activeUserEmail$ = this.userDetails$.pipe(
    map((userDetails) => userDetails?.email)
  );
  private readonly url = "/api/0/users/me/";

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.getUserDetailsAction
      .pipe(
        exhaustMap(() =>
          this.retrieveUserDetails().pipe(
            tap((resp: User) => this.setUserDetails(resp)),
            catchError(() => EMPTY)
          )
        )
      )
      .subscribe();
  }

  /** Get and set current logged in user details from backend */
  getUserDetails() {
    this.getUserDetailsAction.next(undefined);
  }

  private retrieveUserDetails() {
    return this.http.get<User>(this.url);
  }

  deleteUser() {
    return this.http.delete(this.url);
  }

  updateUserOptions(name: string, options: { [key: string]: string }) {
    return this.patchUser({ name, options })
      .pipe(
        tap(() => {
          this.getUserDetails();
          this.snackBar.open("Preferences have been updated")
        })
      )
      .toPromise();
  }

  private patchUser(user: Partial<User>) {
    return this.http.patch(this.url, user);
  }

  disconnectSocialAccount(accountId: number) {
    this.setDisconnectLoading(accountId);
    this.http
      .post("/api/socialaccounts/" + accountId + "/disconnect/", {})
      .pipe(
        tap(() => {
          this.setDisconnectLoading(null);
          this.getUserDetails();
          this.snackBar.open(
            "You have successfully disconnected your social auth account"
          );
        }),
        catchError((err: HttpErrorResponse) => {
          this.setDisconnectLoading(null);
          if (Array.isArray(err.error) && err.error.length) {
            this.snackBar.open(err.error[0]);
          }
          return EMPTY;
        })
      )
      .toPromise();
  }

  private setDisconnectLoading(loading: number | null) {
    this.state.next({ ...this.state.getValue(), disconnectLoading: loading });
  }

  private setUserDetails(userDetails: User) {
    this.state.next({ ...this.state.getValue(), user: userDetails });
  }
}

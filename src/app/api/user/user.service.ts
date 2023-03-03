import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY, Subject } from "rxjs";
import { tap, map, catchError, exhaustMap } from "rxjs/operators";
import { StatefulService } from "src/app/shared/stateful-service/stateful-service";
import { User, UserOptions } from "./user.interfaces";
import { UserAPIService } from "./user-api.service";
import { SocialAuthAPIService } from "../social-auth/social-auth-api.service";

interface UserState {
  user: User | null;
  userDeleteError: string | null;
  userDeleteLoading: boolean;
  disconnectLoading: number | null;
}

const initialState: UserState = {
  user: null,
  userDeleteError: null,
  userDeleteLoading: false,
  disconnectLoading: null,
};

@Injectable({
  providedIn: "root",
})
export class UserService extends StatefulService<UserState> {
  readonly userDetails$ = this.state.pipe(map((state) => state.user));
  readonly userDeleteError$ = this.state.pipe(
    map((state) => state.userDeleteError)
  );
  readonly userDeleteLoading$ = this.state.pipe(
    map((state) => state.userDeleteLoading)
  );
  readonly disconnectLoading$ = this.state.pipe(
    map((state) => state.disconnectLoading)
  );
  private readonly getUserDetailsAction = new Subject();

  readonly activeUserEmail$ = this.userDetails$.pipe(
    map((userDetails) => userDetails?.email)
  );

  constructor(
    private snackBar: MatSnackBar,
    private userAPIService: UserAPIService,
    private socialAuthAPIService: SocialAuthAPIService
  ) {
    super(initialState);
    this.getUserDetailsAction
      .pipe(
        exhaustMap(() =>
          this.userAPIService.retrieve().pipe(
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

  deleteUser() {
    this.setUserDeleteLoading(true);
    return this.userAPIService.destroy().pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          this.setUserDeleteError(
            err.error?.message ? err.error?.message : "Unable to delete user"
          );
        }
        return EMPTY;
      })
    );
  }

  updateUser(name: string, options: UserOptions) {
    return this.userAPIService
      .update({ name, options })
      .pipe(
        tap(() => {
          this.getUserDetails();
          this.snackBar.open("Preferences have been updated");
        })
      )
      .toPromise();
  }

  disconnectSocialAccount(accountId: number) {
    this.setDisconnectLoading(accountId);
    this.socialAuthAPIService
      .disconnect(accountId)
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

  clearUserUIState() {
    this.setInitialUserUIState();
  }

  private setUserDeleteLoading(loading: boolean) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      userDeleteLoading: loading,
    });
  }

  private setDisconnectLoading(loading: number | null) {
    this.state.next({ ...this.state.getValue(), disconnectLoading: loading });
  }

  private setUserDetails(userDetails: User) {
    this.state.next({ ...this.state.getValue(), user: userDetails });
  }

  private setInitialUserUIState() {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      userDeleteError: initialState.userDeleteError,
      userDeleteLoading: initialState.userDeleteLoading,
      disconnectLoading: initialState.disconnectLoading,
    });
  }

  private setUserDeleteError(error: string) {
    this.setUserDeleteLoading(false);
    const state = this.state.getValue();
    this.state.next({
      ...state,
      userDeleteError: error,
    });
  }
}

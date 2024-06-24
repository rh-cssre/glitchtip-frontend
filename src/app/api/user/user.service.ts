import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY, lastValueFrom, Subject } from "rxjs";
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
            tap((resp: User) => {
              this.setUserDetails(resp);
              if (resp.chatwootIdentifierHash) {
                let chatwootUser = {
                  email: resp.email,
                  identifier_hash: resp.chatwootIdentifierHash,
                };
                // Chatwoot may not always be ready at this point
                if ((window as any).$chatwoot) {
                  (window as any).$chatwoot.setUser(resp.id, chatwootUser);
                } else {
                  window.addEventListener("chatwoot:ready", function () {
                    (window as any).$chatwoot.setUser(resp.id, chatwootUser);
                  });
                }
              }
            }),
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
    this.setUserDeleteLoadingStart();
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
    lastValueFrom(
      this.userAPIService.update({ name, options }).pipe(
        tap((resp) => {
          this.setUserDetails(resp);
          this.snackBar.open("Preferences have been updated");
        })
      )
    );
  }

  disconnectSocialAccount(id: number, account: string, provider: string) {
    this.setDisconnectLoadingStart(id);
    lastValueFrom(
      this.socialAuthAPIService.disconnect(account, provider).pipe(
        tap(() => {
          this.setDisconnectLoadingEnd();
          this.getUserDetails();
          this.snackBar.open(
            "You have successfully disconnected your social auth account"
          );
        }),
        catchError((err: HttpErrorResponse) => {
          this.setDisconnectLoadingEnd();
          if (Array.isArray(err.error) && err.error.length) {
            this.snackBar.open(err.error[0]);
          }
          return EMPTY;
        })
      ),
      { defaultValue: null }
    );
  }

  clearUserUIState() {
    this.setState({
      userDeleteError: initialState.userDeleteError,
      userDeleteLoading: initialState.userDeleteLoading,
      disconnectLoading: initialState.disconnectLoading,
    });
  }

  private setUserDeleteLoadingStart() {
    this.setState({
      userDeleteLoading: true,
    });
  }

  private setDisconnectLoadingStart(loading: number) {
    this.setState({ disconnectLoading: loading });
  }

  private setDisconnectLoadingEnd() {
    this.setState({ disconnectLoading: null });
  }

  private setUserDetails(user: User) {
    this.setState({ user });
  }

  private setUserDeleteError(error: string) {
    this.setState({
      userDeleteLoading: false,
      userDeleteError: error,
    });
  }
}

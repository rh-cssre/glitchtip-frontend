import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap, catchError, map } from "rxjs/operators";
import { EMPTY, BehaviorSubject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

interface ResetPasswordState {
  setNewPasswordError: string;
  setNewPasswordLoading: boolean;
  sendResetEmailError: string;
  sendResetEmailLoading: boolean;
  sendResetEmailSuccess: string;
}

const initialState: ResetPasswordState = {
  setNewPasswordError: "",
  setNewPasswordLoading: false,
  sendResetEmailError: "",
  sendResetEmailLoading: false,
  sendResetEmailSuccess: "",
};

@Injectable({
  providedIn: "root",
})
export class ResetPasswordService {
  private readonly resetUrl = "/rest-auth/password/reset/";
  private readonly confirmUrl = "/rest-auth/password/reset/confirm/";
  private readonly state = new BehaviorSubject<ResetPasswordState>(
    initialState
  );
  private readonly getState$ = this.state.asObservable();
  readonly setNewPasswordError$ = this.getState$.pipe(
    map((data) => data.setNewPasswordError)
  );
  readonly setNewPasswordLoading$ = this.getState$.pipe(
    map((data) => data.setNewPasswordLoading)
  );
  readonly sendResetEmailError$ = this.getState$.pipe(
    map((data) => data.sendResetEmailError)
  );
  readonly sendResetEmailLoading$ = this.getState$.pipe(
    map((data) => data.sendResetEmailLoading)
  );
  readonly sendResetEmailSuccess$ = this.getState$.pipe(
    map((data) => data.sendResetEmailSuccess)
  );

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  sendResetEmail(email: string) {
    this.setSendResetEmailLoading(true);
    this.postEmailToReset(email)
      .pipe(
        tap((_) => {
          console.log(_);
          this.setSendResetEmailLoading(false),
            this.setSendResetEmailSuccess(
              `If you have an account with GlitchTip, an email has been sent to ${email}`
            );
        }),
        catchError((error) => {
          this.setSendResetEmailLoading(false);
          if (error.status === 500) {
            this.setSendResetEmailError(
              "There was a problem on our end. Try again later."
            );
          } else if (error.error?.detail) {
            this.setSendResetEmailError(error.error.detail);
          } else {
            this.setSendResetEmailError(
              "There was a problem. Try again later."
            );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  setNewPassword(
    newPassword1: string,
    newPassword2: string,
    uid: string,
    token: string
  ) {
    this.setNewPasswordLoading(true);
    this.postNewPassword(newPassword1, newPassword2, uid, token)
      .pipe(
        tap((_) => {
          this.setNewPasswordLoading(false);
          this.snackBar.open("Your password has been changed.");
          this.router.navigate(["/login"]);
        }),
        catchError((error) => {
          this.setNewPasswordLoading(false);
          if (error.status === 500) {
            this.setNewPasswordError(
              "There was a problem on our end. Try again later."
            );
          } else if (error.error?.detail) {
            this.setNewPasswordError(error.error.detail);
          } else {
            this.setNewPasswordError("There was a problem. Try again later.");
          }
          return EMPTY;
        })
      )
      .toPromise();
  }

  private postEmailToReset(email: string) {
    return this.http.post<string>(this.resetUrl, { email });
  }

  private postNewPassword(
    newPassword1: string,
    newPassword2: string,
    uid: string,
    token: string
  ) {
    return this.http.post<string>(this.confirmUrl, {
      new_password1: newPassword1,
      new_password2: newPassword2,
      uid,
      token,
    });
  }

  clearState() {
    this.state.next(initialState);
  }

  private setNewPasswordError(errorMessage: string) {
    this.state.next({
      ...this.state.getValue(),
      setNewPasswordError: errorMessage,
    });
  }

  private setNewPasswordLoading(loading: boolean) {
    this.state.next({
      ...this.state.getValue(),
      setNewPasswordLoading: loading,
    });
  }

  private setSendResetEmailError(errorMessage: string) {
    this.state.next({
      ...this.state.getValue(),
      sendResetEmailError: errorMessage,
    });
  }

  private setSendResetEmailLoading(loading: boolean) {
    this.state.next({
      ...this.state.getValue(),
      sendResetEmailLoading: loading,
    });
  }

  private setSendResetEmailSuccess(message: string) {
    this.state.next({
      ...this.state.getValue(),
      sendResetEmailSuccess: message,
    });
  }
}

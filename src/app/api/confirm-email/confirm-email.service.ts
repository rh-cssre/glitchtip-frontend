import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class ConfirmEmailService {
  private readonly url = "/_allauth/browser/v1/auth/email/verify";

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  confirmEmail(key: string) {
    this.postConfirmEmailKey(key)
      .pipe(
        tap((_) => {
          this.setSnackbarMessage("Your email address has been confirmed.");
          this.router.navigate(["profile"]);
        }),
        catchError((error) => {
          if (error.error?.detail === "Not found.") {
            this.setSnackbarMessage(`
                This e-mail confirmation link expired or is invalid. Please
                issue a new e-mail confirmation request.
            `);
          } else {
            this.setSnackbarMessage(error.error?.detail);
          }
          this.router.navigate(["profile"]);
          return EMPTY;
        })
      )
      .subscribe();
  }

  postConfirmEmailKey(key: string) {
    return this.http.post<string>(this.url, { key });
  }

  private setSnackbarMessage(message: string) {
    this.snackBar.open(message);
  }
}

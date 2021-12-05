import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { EMPTY } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AuthService } from "src/app/api/auth/auth.service";
import { UserService } from "src/app/api/user/user.service";

@Component({
  selector: "gt-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent {
  deleteLoading = false;
  deleteError = "";

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  deleteUser() {
    if (
      window.confirm(
        `Are you sure you want to delete your user account? You will permanently lose access to all organizations, projects, and teams associated with it.`
      )
    ) {
      this.deleteLoading = true;
      this.userService
        .deleteUser()
        .pipe(
          tap(() => this.authService.removeAuth()),
          catchError((err) => {
            this.deleteLoading = false;
            if (err instanceof HttpErrorResponse) {
              this.deleteError = "Unable to delete user";
            }
            return EMPTY;
          })
        )
        .toPromise();
    }
  }
}

import { Component, OnDestroy } from "@angular/core";
import { lastValueFrom, tap } from "rxjs";
import { AuthService } from "src/app/api/auth/auth.service";
import { UserService } from "src/app/api/user/user.service";

@Component({
  selector: "gt-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnDestroy {
  userDeleteLoading$ = this.userService.userDeleteLoading$;
  userDeleteError$ = this.userService.userDeleteError$;

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
      lastValueFrom(
        this.userService
          .deleteUser()
          .pipe(tap(() => this.authService.removeAuth()))
      );
    }
  }

  ngOnDestroy(): void {
    this.userService.clearUserUIState();
  }
}

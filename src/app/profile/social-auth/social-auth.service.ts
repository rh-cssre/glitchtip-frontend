import { Injectable, computed, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { catchError, combineLatest, map, tap, throwError } from "rxjs";
import { AccountService } from "src/app/api/allauth/account.service";
import { AllAuthHttpErrorResponse } from "src/app/api/allauth/allauth.interfaces";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { StatefulService } from "src/app/shared/stateful-service/signal-state.service";

export interface SocialAuthState {
  loadingId: number | null;
}

const initialState: SocialAuthState = {
  loadingId: null,
};

@Injectable({
  providedIn: "root",
})
export class SocialAuthService extends StatefulService<SocialAuthState> {
  private accountService = inject(AccountService);
  private settingsService = inject(SettingsService);
  private userService = inject(UserService);

  loadingId = computed(() => this.state().loadingId);
  socialApps = this.settingsService.socialApps;
  user$ = combineLatest([toObservable(this.userService.user)]).pipe(
    map(([userDetails]) => {
      const socialApps = this.socialApps();
      let socialAccountsWithNames = userDetails?.identities.map(
        (socialAccount) => {
          return {
            ...socialAccount,
            name: socialApps.find(
              (socialApp) => socialApp.provider === socialAccount.provider,
            )?.name,
          };
        },
      );
      return {
        ...userDetails,
        identities: socialAccountsWithNames,
      };
    }),
  );
  constructor() {
    super(initialState);
  }

  disconnect(id: number, provider: string, account: string) {
    this.setState({ loadingId: id });
    return this.accountService.disconnectProvider(provider, account).pipe(
      tap(() => {
        this.setState({ loadingId: null });
        this.userService.getUserDetails();
      }),
      catchError((err: AllAuthHttpErrorResponse) => {
        this.setState({ loadingId: null });
        return throwError(() => err);
      }),
    );
  }
}

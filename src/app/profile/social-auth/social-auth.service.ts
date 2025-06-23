import { Injectable, computed, inject } from "@angular/core";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { client } from "src/app/shared/api/api";
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
  private settingsService = inject(SettingsService);
  private userService = inject(UserService);

  loadingId = computed(() => this.state().loadingId);
  socialApps = this.settingsService.socialApps;
  user = computed(() => {
    const userDetails = this.userService.user();
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
  });
  constructor() {
    super(initialState);
  }

  async disconnect(id: number, provider: string, account: string) {
    this.setState({ loadingId: id });
    await client.DELETE("/_allauth/browser/v1/account/providers", {
      body: {
        provider,
        account,
      },
    });
    this.setState({ loadingId: null });
    this.userService.getUserDetails();
  }
}

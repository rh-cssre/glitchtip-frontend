import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UntypedFormControl, ReactiveFormsModule } from "@angular/forms";
import { combineLatest, map } from "rxjs";
import { GlitchTipOAuthService } from "src/app/api/oauth/oauth.service";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { SocialApp } from "../../api/user/user.interfaces";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { AuthSvgComponent } from "../../shared/auth-svg/auth-svg.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { NgIf, NgFor, AsyncPipe } from "@angular/common";

@Component({
  selector: "gt-social-auth",
  templateUrl: "./social-auth.component.html",
  styleUrls: ["./social-auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgFor,
    MatOptionModule,
    AuthSvgComponent,
    MatDividerModule,
    MatButtonModule,
    AsyncPipe,
  ],
})
export class SocialAuthComponent implements OnInit {
  disconnectLoading$ = this.userService.disconnectLoading$;
  socialApps$ = this.settingsService.socialApps$;
  user$ = combineLatest([this.socialApps$, this.userService.userDetails$]).pipe(
    map(([socialApps, userDetails]) => {
      let socialAccountsWithNames = userDetails?.identities.map(
        (socialAccount) => {
          return {
            ...socialAccount,
            name: socialApps.find(
              (socialApp) => socialApp.provider === socialAccount.provider
            )?.name,
          };
        }
      );
      return {
        ...userDetails,
        identities: socialAccountsWithNames,
      };
    })
  );
  account = new UntypedFormControl();

  constructor(
    private userService: UserService,
    private oauthService: GlitchTipOAuthService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.userService.getUserDetails();
  }

  addAccount() {
    // No connection for GitHub because it doesn't allow for multiple redirect URI's
    // Can connect to GitHub on the log in page
    const socialApp: SocialApp = this.account.value;
    this.oauthService.initOAuthLogin(socialApp);
  }

  disconnect(id: number, account: string, provider: string) {
    this.userService.disconnectSocialAccount(id, account, provider);
  }
}

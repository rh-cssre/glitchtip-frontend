import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "src/app/api/user/user.service";
import { AuthenticationService } from "src/app/api/allauth/authentication.service";
import { AuthSvgComponent } from "../../shared/auth-svg/auth-svg.component";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { SocialAuthService, SocialAuthState } from "./social-auth.service";

@Component({
  selector: "gt-social-auth",
  templateUrl: "./social-auth.component.html",
  styleUrls: ["./social-auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    AuthSvgComponent,
    MatDividerModule,
    MatButtonModule,
  ],
})
export class SocialAuthComponent
  extends StatefulComponent<SocialAuthState, SocialAuthService>
  implements OnInit
{
  protected service: SocialAuthService;
  private userService = inject(UserService);
  private authenticationService = inject(AuthenticationService);
  private snackBar = inject(MatSnackBar);

  socialApps = this.service.socialApps;
  user = this.service.user;
  disconnectLoadingId = this.service.loadingId;
  account = new FormControl();

  constructor() {
    const service = inject(SocialAuthService);

    super(service);

    this.service = service;
  }

  ngOnInit() {
    this.userService.getUserDetails();
  }

  addAccount() {
    this.authenticationService.providerRedirect(
      this.account.value.provider,
      window.location.href,
      "connect",
    );
  }

  async disconnect(id: number, provider: string, account: string) {
    const user = this.user();
    if (user) {
      if (user.hasPasswordAuth || user.identities!.length > 1) {
        await this.service.disconnect(id, provider, account);
        this.snackBar.open(
          $localize`You have successfully disconnected your social auth account`,
        );
        // if (err.status === 400 && err.error.errors?.length) {
        //   this.snackBar.open(err.error.errors[0].message);
        //   return of(undefined);
        // }
        // this.snackBar.open(UNHANDLED_ERROR);
      } else {
        this.snackBar.open($localize`Your account has no password set up.`);
      }
    }
  }
}

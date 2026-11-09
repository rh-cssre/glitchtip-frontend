import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  computed,
  inject,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "src/app/api/user/user.service";
import { AuthenticationService } from "src/app/api/allauth/authentication.service";
import { AuthSvgComponent } from "../../shared/auth-svg/auth-svg.component";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { SocialAuthService, SocialAuthState } from "./social-auth.service";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";

@Component({
  selector: "gt-social-auth",
  templateUrl: "./social-auth.component.html",
  styleUrls: ["./social-auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatOptionModule,
    AuthSvgComponent,
    ListComponent,
    ListRowComponent,
    LoadingButtonComponent,
    SettingsSectionComponent,
    EmptyStateComponent,
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
  private dialog = inject(MatDialog);

  socialApps = this.service.socialApps;
  user = this.service.user;
  disconnectLoadingId = this.service.loadingId;
  disconnectLabel = (name: string) => $localize`Disconnect ${name}:name:`;
  account = new FormControl<string | null>(null, Validators.required);
  /** The last sign-in method can't go; a password has to exist first. */
  canDisconnect = computed(() => {
    const user = this.user();
    return !!user && (user.hasPasswordAuth || user.identities.length > 1);
  });

  constructor() {
    const service = inject(SocialAuthService);

    super(service);

    this.service = service;
  }

  ngOnInit() {
    this.userService.getUserDetails();
  }

  addAccount() {
    const provider = this.account.value;
    if (!provider) {
      this.account.markAsTouched();
      return;
    }
    this.authenticationService.providerRedirect(
      provider,
      window.location.href,
      "connect",
    );
  }

  disconnect(id: number, provider: string, account: string, name: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Disconnect ${name}:provider:?`,
          message: $localize`You will no longer sign in with this account.`,
          confirmText: $localize`Disconnect`,
        },
      })
      .afterClosed()
      .subscribe(async (confirmed) => {
        if (!confirmed || !this.canDisconnect()) return;
        await this.service.disconnect(id, provider, account);
        this.snackBar.open(
          $localize`You have successfully disconnected your social auth account`,
        );
      });
  }
}

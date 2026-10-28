import {
  Component,
  computed,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { AuthTokensService, AuthTokensState } from "./auth-tokens.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { Clipboard } from "@angular/cdk/clipboard";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { scopesLabel } from "./token-scopes";

@Component({
  selector: "gt-auth-tokens",
  templateUrl: "./auth-tokens.component.html",
  styleUrls: ["./auth-tokens.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatButtonModule,
    MatIconModule,
    LoadingButtonComponent,
    EmptyStateComponent,
    ListComponent,
    ListRowComponent,
    PanelComponent,
    SettingsSectionComponent,
  ],
})
export class AuthTokensComponent
  extends StatefulComponent<AuthTokensState, AuthTokensService>
  implements OnInit
{
  protected service: AuthTokensService;
  dialog = inject(MatDialog);
  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);
  scopesLabel = scopesLabel;
  copyLabel = (label: string) => $localize`Copy ${label}:label: token`;

  authTokens = computed(() =>
    this.service.apiTokens()?.map((token) => {
      let isLoading = this.service.deleteLoading().includes(token.id);
      return { ...token, isLoading };
    }),
  );
  deleteLoading = this.service.deleteLoading;
  initialLoad = this.service.initialLoad;

  constructor() {
    const service = inject(AuthTokensService);

    super(service);

    this.service = service;
  }

  ngOnInit(): void {
    this.service.apiTokensResource.reload();
  }

  copyToken(token: string) {
    if (this.clipboard.copy(token)) {
      this.snackBar.open($localize`Token copied to clipboard.`);
    }
  }

  deleteAuthToken(id: number, label: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete ${label}:label:?`,
        message: $localize`Anything using this token loses access to the API. This cannot be undone.`,
        confirmText: $localize`Delete`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.deleteAuthToken(id);
      }
    });
  }
}

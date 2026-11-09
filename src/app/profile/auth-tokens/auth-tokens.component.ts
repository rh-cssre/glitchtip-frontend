import {
  Component,
  computed,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { AuthTokensService, AuthTokensState } from "./auth-tokens.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { MatDialog } from "@angular/material/dialog";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";
import { CopyInputComponent } from "src/app/shared/copy-input/copy-input.component";
import { EmptyStateComponent } from "src/app/shared/empty-state/empty-state.component";
import { ListComponent } from "src/app/shared/list/list.component";
import { ListRowComponent } from "src/app/shared/list/list-row.component";
import { SettingsSectionComponent } from "src/app/shared/settings-section/settings-section.component";
import { scopesLabel } from "./token-scopes";

@Component({
  selector: "gt-auth-tokens",
  templateUrl: "./auth-tokens.component.html",
  styleUrls: ["./auth-tokens.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LoadingButtonComponent,
    CopyInputComponent,
    EmptyStateComponent,
    ListComponent,
    ListRowComponent,
    SettingsSectionComponent,
  ],
})
export class AuthTokensComponent
  extends StatefulComponent<AuthTokensState, AuthTokensService>
  implements OnInit
{
  protected service: AuthTokensService;
  dialog = inject(MatDialog);
  scopesLabel = scopesLabel;
  deleteLabel = (label: string) => $localize`Delete ${label}:label:`;

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

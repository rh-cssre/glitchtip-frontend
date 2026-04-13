import { Component, computed, OnInit, inject } from "@angular/core";
import { AuthTokensService, AuthTokensState } from "./auth-tokens.service";
import { LoadingButtonComponent } from "../../shared/loading-button/loading-button.component";
import { CopyInputComponent } from "../../shared/copy-input/copy-input.component";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "gt-auth-tokens",
  templateUrl: "./auth-tokens.component.html",
  styleUrls: ["./auth-tokens.component.scss"],
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatDividerModule,
    CopyInputComponent,
    LoadingButtonComponent,
  ],
})
export class AuthTokensComponent
  extends StatefulComponent<AuthTokensState, AuthTokensService>
  implements OnInit
{
  protected service: AuthTokensService;
  dialog = inject(MatDialog);

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

  deleteAuthToken(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      restoreFocus: false,
      height: "200px",
      width: "350px",
      data: {
        title: $localize`Delete Auth Token`,
        message: $localize`Are you sure you want to delete this authentication token?`,
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

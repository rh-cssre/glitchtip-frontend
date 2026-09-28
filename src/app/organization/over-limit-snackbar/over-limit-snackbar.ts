import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from "@angular/material/snack-bar";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";

interface OverLimitSnackbarData {
  activeOrgSlug: string;
  throttleRate: number;
}

@Component({
  selector: "gt-over-limit-snackbar",
  imports: [RouterLink, MatIcon, MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: "./over-limit-snackbar.html",
  styleUrl: "./over-limit-snackbar.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverLimitSnackbar {
  private subscriptionService = inject(SubscriptionService);
  private data = inject<OverLimitSnackbarData>(MAT_SNACK_BAR_DATA);

  readonly snackBarRef =
    inject<MatSnackBarRef<OverLimitSnackbar>>(MatSnackBarRef);
  readonly activeOrgSlug = this.data.activeOrgSlug;
  /** Percent dropped, from the org payload; overage status loads later. */
  readonly throttleRate = this.data.throttleRate;
  /** Which remedy to offer; `unknown` until overage status loads. */
  readonly throttleState = this.subscriptionService.throttleState;
}

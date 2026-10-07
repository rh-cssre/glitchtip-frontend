import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
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
  /**
   * Only a free org can change plan itself; a paid one gets in touch, as the
   * upgrade banner says. `null` until the subscription loads, so a paid org is
   * never told to upgrade in the meantime.
   */
  readonly paid = computed(() => {
    const resource = this.subscriptionService.subscriptionResource;
    if (!resource.hasValue()) return null;
    return (this.subscriptionService.subscription()?.effectivePrice ?? 0) > 0;
  });
}

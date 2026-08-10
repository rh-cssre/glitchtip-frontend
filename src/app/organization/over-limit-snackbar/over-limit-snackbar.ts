import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
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

interface OverLimitSnackbarData {
  activeOrgSlug: string;
  overageEnabled: boolean;
}

@Component({
  selector: "gt-over-limit-snackbar",
  imports: [RouterLink, MatIcon, MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: "./over-limit-snackbar.html",
  styleUrl: "./over-limit-snackbar.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverLimitSnackbar {
  readonly activeOrgSlug: string;
  readonly overageEnabled: boolean;

  constructor(
    public snackBarRef: MatSnackBarRef<OverLimitSnackbar>,
    @Inject(MAT_SNACK_BAR_DATA) data: OverLimitSnackbarData,
  ) {
    this.activeOrgSlug = data.activeOrgSlug;
    this.overageEnabled = data.overageEnabled;
  }
}

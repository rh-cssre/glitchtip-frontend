/**
 * Convenience module for Material modules used everywhere
 * Before adding a new module, consider if you can add it just to one or two lazy
 * loaded modules instead
 */

import { NgModule } from "@angular/core";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { LessAnnoyingErrorStateMatcher } from "./less-annoying-error-state-matcher";

export const COMPONENTS = [
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  ClipboardModule,
];

@NgModule({
  imports: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    { provide: ErrorStateMatcher, useClass: LessAnnoyingErrorStateMatcher },
  ],
})
export class MaterialModule {}

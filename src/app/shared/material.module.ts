import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSelectModule } from "@angular/material/select";
import { MatListModule } from "@angular/material/list";
import { MatInputModule } from "@angular/material/input";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

// Import all material modules that are used in lazy loaded components here
// Do not include this module in modules that are not lazy loaded

export const COMPONENTS = [
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: COMPONENTS,
  exports: COMPONENTS,
})
export class MaterialModule {}

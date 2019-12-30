import { NgModule } from "@angular/core";

// Import all material modules that are used in lazy loaded components here
// Do not include this module in modules that are not lazy loaded

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule
} from "@angular/material";

export const COMPONENTS = [
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDividerModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule
];

@NgModule({
  imports: COMPONENTS,
  exports: COMPONENTS
})
export class MaterialModule {}

import { NgModule } from "@angular/core";

// Import all material modules that are used in lazy loaded components here
// Do not include this module in modules that are not lazy loaded
import {
  MatButtonModule,
  MatMenuModule,
  MatDividerModule,
  MatListModule,
  MatToolbarModule,
  MatSidenavModule
} from "@angular/material";

export const COMPONENTS = [
  MatButtonModule,
  MatMenuModule,
  MatDividerModule,
  MatListModule,
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule
];
@NgModule({
  exports: COMPONENTS,
  imports: COMPONENTS
})
export class MaterialModule {}

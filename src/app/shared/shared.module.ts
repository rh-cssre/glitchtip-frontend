import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  MatButtonModule,
  MatMenuModule,
  MatDividerModule,
  MatListModule
} from "@angular/material";

// Components
import { MainNavComponent } from "./main-nav/main-nav.component";

export const COMPONENTS = [MainNavComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class SharedModule {}

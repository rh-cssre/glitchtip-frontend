import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

// Material
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";

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

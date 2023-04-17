import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { MainNavComponent } from "./main-nav/main-nav.component";
import { MaterialModule } from "../shared/material.module";
import { MobileNavToolbarModule } from "../mobile-nav-toolbar/mobile-nav-toolbar.module";

@NgModule({
  declarations: [MainNavComponent],
  imports: [CommonModule, RouterModule, MaterialModule, MobileNavToolbarModule],
  exports: [MainNavComponent],
})
export class MainNavModule {}

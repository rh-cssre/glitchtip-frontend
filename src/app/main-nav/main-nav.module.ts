import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { MainNavComponent } from "./main-nav/main-nav.component";
import { MaterialModule } from "../shared/material.module";

@NgModule({
  declarations: [MainNavComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [MainNavComponent],
})
export class MainNavModule {}
